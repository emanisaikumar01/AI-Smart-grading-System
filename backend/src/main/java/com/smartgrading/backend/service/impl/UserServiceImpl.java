package com.smartgrading.backend.service.impl;
import com.smartgrading.backend.config.JwtTokenProvider; import com.smartgrading.backend.dto.*; import com.smartgrading.backend.entity.User; import com.smartgrading.backend.exception.*; import com.smartgrading.backend.repository.UserRepository; import com.smartgrading.backend.service.UserService; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
@Service @Transactional public class UserServiceImpl implements UserService {
 private final UserRepository users; private final PasswordEncoder encoder; private final JwtTokenProvider tokens;
 public UserServiceImpl(UserRepository users,PasswordEncoder encoder,JwtTokenProvider tokens){this.users=users;this.encoder=encoder;this.tokens=tokens;}
 public AuthResponse register(RegisterRequest r){if(users.existsByEmail(r.email())) throw new UserAlreadyExistsException("Email already registered"); User u=new User();u.setName(r.name());u.setEmail(r.email());u.setPassword(encoder.encode(r.password()));u.setRole(r.role());u=users.save(u);return new AuthResponse(tokens.create(u.getEmail()),UserResponse.from(u));}
 @Transactional(readOnly=true) public AuthResponse login(LoginRequest r){User u=users.findByEmail(r.email()).orElseThrow(InvalidCredentialsException::new);if(!encoder.matches(r.password(),u.getPassword())) throw new InvalidCredentialsException();return new AuthResponse(tokens.create(u.getEmail()),UserResponse.from(u));}
}
