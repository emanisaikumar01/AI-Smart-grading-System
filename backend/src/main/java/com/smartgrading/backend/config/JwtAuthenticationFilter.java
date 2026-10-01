package com.smartgrading.backend.config;
import com.smartgrading.backend.repository.UserRepository; import jakarta.servlet.*; import jakarta.servlet.http.*; import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; import org.springframework.security.core.authority.SimpleGrantedAuthority; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter;
@Component public class JwtAuthenticationFilter extends OncePerRequestFilter {
 private final JwtTokenProvider tokens; private final UserRepository users;
 public JwtAuthenticationFilter(JwtTokenProvider tokens,UserRepository users) { this.tokens=tokens; this.users=users; }
 @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain) throws ServletException,IOException { String h=req.getHeader("Authorization"); if(h!=null&&h.startsWith("Bearer ")) tokens.validateAndGetSubject(h.substring(7)).flatMap(users::findByEmail).ifPresent(u->{ var auth=new UsernamePasswordAuthenticationToken(u.getEmail(),null,java.util.List.of(new SimpleGrantedAuthority("ROLE_"+u.getRole().name()))); SecurityContextHolder.getContext().setAuthentication(auth); }); chain.doFilter(req,res); }
}
