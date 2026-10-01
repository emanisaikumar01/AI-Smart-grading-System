package com.smartgrading.backend.service;
import com.smartgrading.backend.entity.Feedback; import com.smartgrading.backend.dto.FeedbackRequest; import java.util.List;
public interface FeedbackService { List<Feedback> byAnswer(Integer answerId); Feedback create(Integer answerId,FeedbackRequest request); }
