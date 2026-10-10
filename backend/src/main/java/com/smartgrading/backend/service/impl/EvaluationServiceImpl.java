package com.smartgrading.backend.service.impl;

import com.smartgrading.backend.dto.EvaluationRequest;
import com.smartgrading.backend.dto.EvaluationResponse;
import com.smartgrading.backend.entity.AiEvaluation;
import com.smartgrading.backend.entity.Grade;
import com.smartgrading.backend.entity.StudentAnswer;
import com.smartgrading.backend.entity.Submission;
import com.smartgrading.backend.entity.SubmissionStatus;
import com.smartgrading.backend.exception.ResourceNotFoundException;
import com.smartgrading.backend.integration.AiGradingClient;
import com.smartgrading.backend.repository.AiEvaluationRepository;
import com.smartgrading.backend.repository.GradeRepository;
import com.smartgrading.backend.repository.StudentAnswerRepository;
import com.smartgrading.backend.repository.SubmissionRepository;
import com.smartgrading.backend.service.EvaluationService;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

@Service
public class EvaluationServiceImpl implements EvaluationService {
    private static final Pattern KEYWORD_SEPARATOR = Pattern.compile("[,;\\r\\n]+");

    private final AiEvaluationRepository evaluations;
    private final GradeRepository grades;
    private final AccessControlService access;
    private final SubmissionRepository submissions;
    private final StudentAnswerRepository answers;
    private final AiGradingClient aiClient;
    private final TransactionTemplate transactions;

    public EvaluationServiceImpl(AiEvaluationRepository evaluations, GradeRepository grades,
            AccessControlService access, SubmissionRepository submissions,
            StudentAnswerRepository answers, AiGradingClient aiClient,
            PlatformTransactionManager transactionManager) {
        this.evaluations = evaluations;
        this.grades = grades;
        this.access = access;
        this.submissions = submissions;
        this.answers = answers;
        this.aiClient = aiClient;
        this.transactions = new TransactionTemplate(transactionManager);
    }

    @Override
    public List<AiEvaluation> byAnswer(Integer answerId) {
        return transactions.execute(status -> {
            access.readableAnswer(answerId);
            return evaluations.findByAnswerIdOrderByIdDesc(answerId);
        });
    }

    @Override
    public List<EvaluationResponse> evaluateSubmission(Integer submissionId) {
        List<EvaluationInput> inputs = transactions.execute(status -> {
            Submission submission = access.submissionById(submissionId);
            access.ownedAssignment(submission.getAssignment().getId());
            List<StudentAnswer> submissionAnswers = answers.findBySubmissionId(submissionId);
            if (submissionAnswers.isEmpty()) throw new IllegalArgumentException("Submission has no answers to evaluate");
            if (submission.getStatus() == SubmissionStatus.GRADED || submission.getStatus() == SubmissionStatus.REVIEWED) {
                return submissionAnswers.stream().map(a -> input(a, true)).toList();
            }

            List<EvaluationInput> result = submissionAnswers.stream().map(a -> input(a, false)).toList();
            submissions.findById(submissionId).orElseThrow().setStatus(SubmissionStatus.PROCESSING);
            return result;
        });

        boolean alreadyGraded = inputs.stream().allMatch(EvaluationInput::alreadyGraded);
        if (!alreadyGraded) {
            for (EvaluationInput input : inputs) {
                if (input.alreadyGraded()) continue;
                AiGradingClient.AiGradingResult result = aiClient.grade(input.request());
                persistResult(input.answerId(), result);
            }
            transactions.executeWithoutResult(status -> {
                Submission submission = submissions.findById(submissionId)
                        .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
                List<StudentAnswer> currentAnswers = answers.findBySubmissionId(submissionId);
                boolean complete = !currentAnswers.isEmpty() && currentAnswers.stream().allMatch(answer ->
                        evaluations.existsByAnswerId(answer.getId()) && grades.existsByAnswerId(answer.getId()));
                if (complete && submission.getStatus() != SubmissionStatus.REVIEWED) {
                    submission.setStatus(SubmissionStatus.GRADED);
                }
            });
        }

        return transactions.execute(status -> answers.findBySubmissionId(submissionId).stream()
                .flatMap(answer -> evaluations.findByAnswerIdOrderByIdDesc(answer.getId()).stream().limit(1))
                .map(EvaluationResponse::from).toList());
    }

    private EvaluationInput input(StudentAnswer answer, boolean forceExisting) {
        boolean done = forceExisting || (evaluations.existsByAnswerId(answer.getId()) && grades.existsByAnswerId(answer.getId()));
        if (done) return new EvaluationInput(answer.getId(), null, true);
        var question = answer.getQuestion();
        if (answer.getAnswerText() == null || answer.getAnswerText().isBlank()) {
            throw new IllegalArgumentException("Student answer " + answer.getId() + " has no typed answer text");
        }
        if (question.getQuestionText() == null || question.getQuestionText().isBlank()) {
            throw new IllegalArgumentException("Question " + question.getId() + " has no question text");
        }
        if (question.getExpectedAnswer() == null || question.getExpectedAnswer().isBlank()) {
            throw new IllegalArgumentException("Question " + question.getId() + " has no expected answer");
        }
        if (question.getMarkingCriteria() == null || question.getMarkingCriteria().isBlank()) {
            throw new IllegalArgumentException("Question " + question.getId() + " has no marking criteria");
        }
        List<String> keywords = Arrays.stream(KEYWORD_SEPARATOR.split(question.getMarkingCriteria()))
                .map(String::trim).filter(value -> !value.isEmpty()).distinct().toList();
        if (keywords.isEmpty()) throw new IllegalArgumentException("Question " + question.getId() + " has no grading keywords in its marking criteria");

        EvaluationRequest request = new EvaluationRequest(question.getQuestionText(), question.getExpectedAnswer(),
                question.getMarkingCriteria(), answer.getAnswerText(), question.getMaxMarks(), keywords);
        return new EvaluationInput(answer.getId(), request, done);
    }

    private void persistResult(Integer answerId, AiGradingClient.AiGradingResult result) {
        transactions.executeWithoutResult(status -> {
            StudentAnswer answer = answers.findLockedById(answerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Answer not found"));
            AiEvaluation evaluation = evaluations.findByAnswerIdOrderByIdDesc(answerId).stream()
                    .findFirst().orElseGet(AiEvaluation::new);
            evaluation.setAnswer(answer);
            evaluation.setAiScore(result.score());
            evaluation.setConfidenceScore(result.confidenceScore());
            evaluation.setEvaluation(result.evaluation());
            evaluation.setAiFeedback(result.feedback());
            evaluations.save(evaluation);

            Grade grade = grades.findByAnswerIdOrderByIdDesc(answerId).stream().findFirst().orElseGet(Grade::new);
            grade.setAnswer(answer);
            grade.setAiScore(result.score());
            if (!Boolean.TRUE.equals(grade.getOverridden())) {
                grade.setTeacherScore(null);
                grade.setFinalScore(result.score());
                grade.setOverridden(false);
            }
            grades.save(grade);
        });
    }

    private record EvaluationInput(Integer answerId, EvaluationRequest request, boolean alreadyGraded) { }
}
