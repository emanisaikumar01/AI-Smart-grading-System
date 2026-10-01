package com.smartgrading.backend.service.impl;
import com.smartgrading.backend.dto.*; import com.smartgrading.backend.entity.Subject; import com.smartgrading.backend.exception.ResourceNotFoundException; import com.smartgrading.backend.repository.SubjectRepository; import com.smartgrading.backend.service.SubjectService; import java.util.List; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
@Service @Transactional public class SubjectServiceImpl implements SubjectService { private final SubjectRepository repo; private final AccessControlService access; public SubjectServiceImpl(SubjectRepository repo,AccessControlService access){this.repo=repo;this.access=access;}
 public SubjectResponse create(SubjectRequest r){access.professor();Subject s=new Subject();s.setName(r.name());s.setDescription(r.description());return SubjectResponse.from(repo.save(s));}
 @Transactional(readOnly=true) public List<SubjectResponse> findAll(){access.current();return repo.findAll().stream().map(SubjectResponse::from).toList();}
 @Transactional(readOnly=true) public SubjectResponse find(Integer id){return SubjectResponse.from(get(id));}
 public SubjectResponse update(Integer id,SubjectRequest r){access.professor();Subject s=get(id);s.setName(r.name());s.setDescription(r.description());return SubjectResponse.from(repo.save(s));}
 public void delete(Integer id){access.professor();repo.delete(get(id));} private Subject get(Integer id){return repo.findById(id).orElseThrow(()->new ResourceNotFoundException("Subject not found"));}
}
