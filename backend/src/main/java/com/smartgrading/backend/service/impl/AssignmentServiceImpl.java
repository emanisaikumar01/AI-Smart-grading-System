package com.smartgrading.backend.service.impl;
import com.smartgrading.backend.dto.*; import com.smartgrading.backend.entity.*; import com.smartgrading.backend.exception.AccessDeniedException; import com.smartgrading.backend.repository.*; import com.smartgrading.backend.service.AssignmentService; import java.util.List; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
@Service @Transactional public class AssignmentServiceImpl implements AssignmentService { private final AssignmentRepository assignments; private final AccessControlService access;
 public AssignmentServiceImpl(AssignmentRepository a,AccessControlService access){assignments=a;this.access=access;}
 public AssignmentResponse create(AssignmentRequest r){ClassEntity c=access.ownedClass(r.classId());Assignment a=new Assignment();a.setClassEntity(c);apply(a,r);a.setStatus(AssignmentStatus.DRAFT);return AssignmentResponse.from(assignments.save(a));}
 @Transactional(readOnly=true) public List<AssignmentResponse> all(){User u=access.current();List<Assignment> list=u.getRole()==Role.PROFESSOR?assignments.findByClassEntityProfessorId(u.getId()):assignments.findVisibleToStudent(u.getId());return list.stream().map(AssignmentResponse::from).toList();}
 @Transactional(readOnly=true) public AssignmentResponse get(Integer id){Assignment a=access.assignmentById(id);checkCanView(a);return AssignmentResponse.from(a);}
 public AssignmentResponse update(Integer id,AssignmentRequest r){Assignment a=access.ownedAssignment(id);if(!a.getClassEntity().getId().equals(r.classId()))throw new IllegalArgumentException("Moving assignments between classes is not supported");apply(a,r);return AssignmentResponse.from(assignments.save(a));}
 public void delete(Integer id){assignments.delete(access.ownedAssignment(id));}
 public AssignmentResponse publish(Integer id){Assignment a=access.ownedAssignment(id);a.setStatus(AssignmentStatus.ACTIVE);return AssignmentResponse.from(assignments.save(a));}
 public AssignmentResponse close(Integer id){Assignment a=access.ownedAssignment(id);a.setStatus(AssignmentStatus.CLOSED);return AssignmentResponse.from(assignments.save(a));}
 private void checkCanView(Assignment a){User u=access.current();if(u.getRole()==Role.PROFESSOR&&!a.getClassEntity().getProfessor().getId().equals(u.getId()))throw new AccessDeniedException("You do not own this assignment");if(u.getRole()==Role.STUDENT&&!access.isEnrolled(a.getClassEntity().getId(),u.getId()))throw new AccessDeniedException("You are not enrolled in this class");}
 private void apply(Assignment a,AssignmentRequest r){a.setTitle(r.title());a.setDescription(r.description());a.setInstructions(r.instructions());a.setTotalMarks(r.totalMarks());a.setDueDate(r.dueDate());}
}
