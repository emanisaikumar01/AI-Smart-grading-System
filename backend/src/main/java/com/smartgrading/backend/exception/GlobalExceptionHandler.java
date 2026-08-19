package com.smartgrading.backend.exception;
import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
@RestControllerAdvice public class GlobalExceptionHandler {
 @ExceptionHandler(ResourceNotFoundException.class) ResponseEntity<ErrorResponse> notFound(ResourceNotFoundException e){return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(404,e.getMessage()));}
 @ExceptionHandler({UserAlreadyExistsException.class}) ResponseEntity<ErrorResponse> conflict(RuntimeException e){return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(409,e.getMessage()));}
 @ExceptionHandler({UnauthorizedException.class}) ResponseEntity<ErrorResponse> unauthorized(RuntimeException e){return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(401,e.getMessage()));}
}
