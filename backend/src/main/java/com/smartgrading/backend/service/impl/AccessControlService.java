package com.smartgrading.backend.service.impl;
import com.smartgrading.backend.entity.*; import com.smartgrading.backend.exception.*; import com.smartgrading.backend.repository.*; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.stereotype.Service;
@Service public class AccessControlService {
 private final UserRepository users; private final ClassRepository classes; private final AssignmentRepository assignments; private final SubmissionRepository submissions; private final StudentAnswerRepository answers; private final ClassStudentRepository memberships;
 public AccessControlService(UserRepository u,ClassRepository c,AssignmentRepository a,SubmissionRepository s,StudentAnswerRepository ans,ClassStudentRepository m){users=u;classes=c;assignments=a;submissions=s;answers=ans;memberships=m;}
 public User current(){var a=SecurityContextHolder.getContext().getAuthentication(); if(a==null||!a.isAuthenticated()||a.getName()==null)throw new AccessDeniedException("Authentication required");return users.findByEmail(a.getName()).orElseThrow(()->new ResourceNotFoundException("User not found"));}
 public User professor(){User u=current();if(u.getRole()!=Role.PROFESSOR)throw new AccessDeniedException("Professor role required");return u;}
 public User student(){User u=current();if(u.getRole()!=Role.STUDENT)throw new AccessDeniedException("Student role required");return u;}
 public ClassEntity classById(Integer id){return classes.findById(id).orElseThrow(()->new ResourceNotFoundException("Class not found"));}
 public ClassEntity ownedClass(Integer id){User p=professor();ClassEntity c=classById(id);if(!c.getProfessor().getId().equals(p.getId()))throw new AccessDeniedException("You do not own this class");return c;}
 public Assignment assignmentById(Integer id){return assignments.findById(id).orElseThrow(()->new ResourceNotFoundException("Assignment not found"));}
 public Assignment ownedAssignment(Integer id){Assignment a=assignmentById(id);if(!a.getClassEntity().getProfessor().getId().equals(professor().getId()))throw new AccessDeniedException("You do not own this assignment");return a;}
 public Submission submissionById(Integer id){return submissions.findById(id).orElseThrow(()->new ResourceNotFoundException("Submission not found"));}
 public Submission readableSubmission(Integer id){Submission s=submissionById(id);User u=current();if(u.getRole()==Role.STUDENT&&!s.getStudent().getId().equals(u.getId()))throw new AccessDeniedException("You cannot access another student's submission");if(u.getRole()==Role.PROFESSOR&&!s.getAssignment().getClassEntity().getProfessor().getId().equals(u.getId()))throw new AccessDeniedException("You do not own this assignment");return s;}
 public StudentAnswer answerById(Integer id){return answers.findById(id).orElseThrow(()->new ResourceNotFoundException("Answer not found"));}
 public StudentAnswer readableAnswer(Integer id){StudentAnswer a=answerById(id);Submission s=a.getSubmission();User u=current();if(u.getRole()==Role.STUDENT&&!s.getStudent().getId().equals(u.getId()))throw new AccessDeniedException("You cannot access another student's answer");if(u.getRole()==Role.PROFESSOR&&!s.getAssignment().getClassEntity().getProfessor().getId().equals(u.getId()))throw new AccessDeniedException("You do not own this assignment");return a;}
 public boolean isEnrolled(Integer classId,Integer studentId){return memberships.existsById(new ClassStudentId(classId,studentId));}
}
