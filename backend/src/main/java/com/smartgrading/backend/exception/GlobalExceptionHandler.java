package com.smartgrading.backend.exception;
import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.time.Instant;
@RestControllerAdvice
public class GlobalExceptionHandler {
 @ExceptionHandler(ResourceNotFoundException.class) ResponseEntity<ApiError> notFound(RuntimeException e) { return response(HttpStatus.NOT_FOUND,e.getMessage()); }
 @ExceptionHandler(UserAlreadyExistsException.class) ResponseEntity<ApiError> conflict(RuntimeException e) { return response(HttpStatus.CONFLICT,e.getMessage()); }
 @ExceptionHandler(InvalidCredentialsException.class) ResponseEntity<ApiError> unauthenticated(RuntimeException e) { return response(HttpStatus.UNAUTHORIZED,e.getMessage()); }
 @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class) ResponseEntity<ApiError> integrity(RuntimeException e) { return response(HttpStatus.CONFLICT,"The request conflicts with existing data"); }
 @ExceptionHandler(AccessDeniedException.class) ResponseEntity<ApiError> forbidden(RuntimeException e) { return response(HttpStatus.FORBIDDEN,e.getMessage()); }
 @ExceptionHandler(IntegrationNotReadyException.class) ResponseEntity<ApiError> notReady(RuntimeException e) { return response(HttpStatus.SERVICE_UNAVAILABLE,e.getMessage()); }
 @ExceptionHandler(AiServiceException.class) ResponseEntity<ApiError> aiService(AiServiceException e) { return response(e.getStatus(),e.getMessage()); }
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ApiError> invalid(MethodArgumentNotValidException e) { return response(HttpStatus.BAD_REQUEST,"Invalid request"); }
 @ExceptionHandler(IllegalArgumentException.class) ResponseEntity<ApiError> badRequest(RuntimeException e) { return response(HttpStatus.BAD_REQUEST,e.getMessage()); }
 @ExceptionHandler(Exception.class) ResponseEntity<ApiError> unexpected(Exception e) { return response(HttpStatus.INTERNAL_SERVER_ERROR,"Unexpected server error"); }
 private ResponseEntity<ApiError> response(HttpStatus s,String m) { return ResponseEntity.status(s).body(new ApiError(s.value(),m,Instant.now())); }
}
