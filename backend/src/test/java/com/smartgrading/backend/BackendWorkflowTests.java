package com.smartgrading.backend;

import com.smartgrading.backend.dto.*;
import com.smartgrading.backend.entity.*;
import com.smartgrading.backend.exception.*;
import com.smartgrading.backend.repository.*;
import com.smartgrading.backend.service.*;
import com.smartgrading.backend.integration.AiGradingClient;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@Transactional
class BackendWorkflowTests {
 @Autowired UserRepository users; @Autowired SubjectRepository subjects; @Autowired ClassRepository classes;
 @Autowired ClassService classService; @Autowired AssignmentService assignmentService; @Autowired QuestionService questionService;
 @Autowired SubmissionService submissionService; @Autowired GradeService gradeService; @Autowired FeedbackService feedbackService;
 @Autowired EvaluationService evaluationService; @Autowired AiEvaluationRepository aiEvaluations; @Autowired GradeRepository grades; @Autowired SubmissionRepository submissions;
 @MockitoBean AiGradingClient aiGradingClient;
 @Autowired UserService userService; @Autowired PasswordEncoder encoder;
 User professor, otherProfessor, student, otherStudent; Subject subject; ClassEntity classroom;

 @BeforeEach void setup(){
  professor=user("Professor One","p1@test.local",Role.PROFESSOR);otherProfessor=user("Professor Two","p2@test.local",Role.PROFESSOR);student=user("Student One","s1@test.local",Role.STUDENT);otherStudent=user("Student Two","s2@test.local",Role.STUDENT);
  subject=new Subject();subject.setName("Test subject");subject.setDescription("Test");subject=subjects.save(subject);
  classroom=new ClassEntity();classroom.setName("CSE");classroom.setSection("A");classroom.setSubject(subject);classroom.setProfessor(professor);classroom=classes.save(classroom);
 }
 @AfterEach void clear(){SecurityContextHolder.clearContext();}
 private User user(String n,String e,Role r){User u=new User();u.setName(n);u.setEmail(e);u.setPassword(encoder.encode("long-test-password"));u.setRole(r);return users.save(u);}
 private void login(User u){SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(u.getEmail(),"",java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_"+u.getRole()))));}
 private AssignmentResponse createActive(){login(professor);AssignmentResponse a=assignmentService.create(new AssignmentRequest(classroom.getId(),"Exam",null,null,new BigDecimal("20.00"),null));return assignmentService.publish(a.id());}

 @Test void registerAndLoginUseHashedPasswords(){AuthResponse registered=userService.register(new RegisterRequest("New Person","new@test.local","strong-password",Role.STUDENT));assertNotNull(registered.token());User persisted=users.findByEmail("new@test.local").orElseThrow();assertNotEquals("strong-password",persisted.getPassword());assertTrue(encoder.matches("strong-password",persisted.getPassword()));assertNotNull(userService.login(new LoginRequest("new@test.local","strong-password")).token());}
 @Test void professorCanAddAndRemoveStudentMembership(){login(professor);classService.addStudent(classroom.getId(),student.getId());assertEquals(1,classService.students(classroom.getId()).size());classService.removeStudent(classroom.getId(),student.getId());assertTrue(classService.students(classroom.getId()).isEmpty());}
 @Test void duplicateMembershipIsRejected(){login(professor);classService.addStudent(classroom.getId(),student.getId());assertThrows(UserAlreadyExistsException.class,()->classService.addStudent(classroom.getId(),student.getId()));}
 @Test void professorCannotModifyAnotherProfessorsClass(){login(otherProfessor);assertThrows(AccessDeniedException.class,()->classService.update(classroom.getId(),new ClassRequest("Changed","B",subject.getId())));}
 @Test void nonStudentCannotBeAddedToClass(){login(professor);assertThrows(IllegalArgumentException.class,()->classService.addStudent(classroom.getId(),otherProfessor.getId()));}
 @Test void professorCannotCreateAssignmentInAnotherProfessorsClass(){login(otherProfessor);assertThrows(AccessDeniedException.class,()->assignmentService.create(new AssignmentRequest(classroom.getId(),"Bad",null,null,new BigDecimal("5"),null)));}
 @Test void studentMustBeEnrolledAndAssignmentActiveToSubmit(){AssignmentResponse a=createActive();login(student);assertThrows(AccessDeniedException.class,()->submissionService.create(a.id(),new SubmissionRequest(null,null)));login(professor);classService.addStudent(classroom.getId(),student.getId());assignmentService.close(a.id());login(student);assertThrows(IllegalArgumentException.class,()->submissionService.create(a.id(),new SubmissionRequest(null,null)));}
 @Test void enrolledStudentMaySubmitOnceAndDuplicateIsRejected(){login(professor);classService.addStudent(classroom.getId(),student.getId());AssignmentResponse a=createActive();login(student);assertNotNull(submissionService.create(a.id(),new SubmissionRequest(null,null)));assertThrows(UserAlreadyExistsException.class,()->submissionService.create(a.id(),new SubmissionRequest(null,null)));}
 @Test void studentCannotReadAnotherStudentsSubmission(){login(professor);classService.addStudent(classroom.getId(),student.getId());AssignmentResponse a=createActive();SubmissionResponse sub=loginAndSubmit(a.id());login(otherStudent);assertThrows(AccessDeniedException.class,()->submissionService.get(sub.id()));}
 @Test void submissionStatusCannotSkipEvaluation(){login(professor);classService.addStudent(classroom.getId(),student.getId());AssignmentResponse a=createActive();SubmissionResponse sub=loginAndSubmit(a.id());login(professor);submissionService.transition(sub.id(),SubmissionStatus.PROCESSING);assertThrows(IllegalArgumentException.class,()->submissionService.transition(sub.id(),SubmissionStatus.GRADED));}
 @Test void questionCreateIsScopedToAssignmentOwnerAndQuestionNumber(){login(professor);AssignmentResponse a=assignmentService.create(new AssignmentRequest(classroom.getId(),"Draft",null,null,new BigDecimal("20"),null));QuestionRequest q=new QuestionRequest(a.id(),1,"Question?",new BigDecimal("10"),"Expected","Criteria");assertNotNull(questionService.create(a.id(),q));assertThrows(UserAlreadyExistsException.class,()->questionService.create(a.id(),q));login(otherProfessor);assertThrows(AccessDeniedException.class,()->questionService.create(a.id(),new QuestionRequest(a.id(),2,"Q2",new BigDecimal("5"),"Expected","Criteria")));}
 @Test void onlyOwningProfessorCanModifyGradeAndStudentCannot(){login(professor);classService.addStudent(classroom.getId(),student.getId());AssignmentResponse a=createActive();SubmissionResponse sub=loginAndSubmit(a.id());login(professor);QuestionResponse q=questionService.create(a.id(),new QuestionRequest(a.id(),1,"Question",new BigDecimal("10"),"Expected","Criteria"));login(student);StudentAnswerResponse answer=submissionService.answer(sub.id(),new StudentAnswerRequest(q.id(),"Answer"));GradeUpdateRequest request=new GradeUpdateRequest(null,new BigDecimal("8"),new BigDecimal("8"),"Reviewed",true);login(otherProfessor);assertThrows(AccessDeniedException.class,()->gradeService.update(answer.id(),request));login(student);assertThrows(AccessDeniedException.class,()->gradeService.update(answer.id(),request));login(professor);Grade g=gradeService.update(answer.id(),request);assertTrue(g.getOverridden());assertNull(g.getAiScore());assertEquals(new BigDecimal("8"),g.getFinalScore());}
 @Test void feedbackWritesAreOwnedAndAiFeedbackCannotBeForged(){login(professor);classService.addStudent(classroom.getId(),student.getId());AssignmentResponse a=createActive();SubmissionResponse sub=loginAndSubmit(a.id());login(professor);QuestionResponse q=questionService.create(a.id(),new QuestionRequest(a.id(),1,"Question",new BigDecimal("10"),"Expected","Criteria"));login(student);StudentAnswerResponse answer=submissionService.answer(sub.id(),new StudentAnswerRequest(q.id(),"Answer"));login(professor);assertThrows(IllegalArgumentException.class,()->feedbackService.create(answer.id(),new FeedbackRequest("Fake AI",FeedbackType.AI)));login(otherProfessor);assertThrows(AccessDeniedException.class,()->feedbackService.create(answer.id(),new FeedbackRequest("Not owned",FeedbackType.TEACHER)));login(student);assertEquals(0,feedbackService.byAnswer(answer.id()).size());}
 @Test void evaluationCallsAiAndPersistsEvaluationAndInitialGrade(){
  login(professor);classService.addStudent(classroom.getId(),student.getId());AssignmentResponse assignment=createActive();
  login(professor);QuestionResponse question=questionService.create(assignment.id(),new QuestionRequest(assignment.id(),1,"Explain plant growth",new BigDecimal("10"),"Plants use sunlight and water","plants; sunlight\nwater"));
  SubmissionResponse submission=loginAndSubmit(assignment.id());login(student);StudentAnswerResponse answer=submissionService.answer(submission.id(),new StudentAnswerRequest(question.id(),"Plants use sunlight and water."));
  when(aiGradingClient.grade(any())).thenReturn(new AiGradingClient.AiGradingResult(new BigDecimal("7.25"),null,"Semantic similarity: 0.8; keywords matched: 3/3.",null,new BigDecimal("0.80"),3,3));
  login(professor);var result=evaluationService.evaluateSubmission(submission.id());
  assertEquals(1,result.size());assertEquals(new BigDecimal("7.25"),result.get(0).aiScore());
  AiEvaluation stored=aiEvaluations.findByAnswerId(answer.id()).getFirst();assertEquals(new BigDecimal("7.25"),stored.getAiScore());assertNull(stored.getConfidenceScore());assertNull(stored.getAiFeedback());
  Grade grade=grades.findByAnswerId(answer.id()).getFirst();assertEquals(new BigDecimal("7.25"),grade.getAiScore());assertEquals(new BigDecimal("7.25"),grade.getFinalScore());assertNull(grade.getTeacherScore());assertFalse(grade.getOverridden());
  assertEquals(SubmissionStatus.GRADED,submissions.findById(submission.id()).orElseThrow().getStatus());
  verify(aiGradingClient).grade(argThat(request->request.keywords().equals(java.util.List.of("plants","sunlight","water"))));
  evaluationService.evaluateSubmission(submission.id());
  assertEquals(1,aiEvaluations.findByAnswerId(answer.id()).size());assertEquals(1,grades.findByAnswerId(answer.id()).size());verify(aiGradingClient,times(1)).grade(any());
 }
 @Test void aiFailureLeavesSubmissionProcessingWithoutFakeRows(){
  login(professor);classService.addStudent(classroom.getId(),student.getId());AssignmentResponse assignment=createActive();
  login(professor);QuestionResponse question=questionService.create(assignment.id(),new QuestionRequest(assignment.id(),1,"Explain plant growth",new BigDecimal("10"),"Expected plants","plants, water"));
  SubmissionResponse submission=loginAndSubmit(assignment.id());login(student);StudentAnswerResponse answer=submissionService.answer(submission.id(),new StudentAnswerRequest(question.id(),"Plants grow."));
  when(aiGradingClient.grade(any())).thenThrow(new com.smartgrading.backend.exception.AiServiceException(org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE,"AI grading service is unavailable"));
  login(professor);assertThrows(com.smartgrading.backend.exception.AiServiceException.class,()->evaluationService.evaluateSubmission(submission.id()));
  assertEquals(SubmissionStatus.PROCESSING,submissions.findById(submission.id()).orElseThrow().getStatus());assertTrue(aiEvaluations.findByAnswerId(answer.id()).isEmpty());assertTrue(grades.findByAnswerId(answer.id()).isEmpty());
 }
 private SubmissionResponse loginAndSubmit(Integer assignmentId){login(student);return submissionService.create(assignmentId,new SubmissionRequest(null,null));}
}
