package com.smartgrading.backend.config;
import javax.crypto.Mac; import javax.crypto.spec.SecretKeySpec; import java.nio.charset.StandardCharsets; import java.time.Instant; import java.util.*;
import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Component;
@Component public class JwtTokenProvider {
 private final String secret; public JwtTokenProvider(@Value("${app.jwt.secret}") String secret) { this.secret=secret; }
 public String create(String email) { long exp=Instant.now().plusSeconds(3600).getEpochSecond(); String h=enc("{\"alg\":\"HS256\",\"typ\":\"JWT\"}"); String p=enc("{\"sub\":\""+email.replace("\\\"","")+"\",\"exp\":"+exp+"}"); String data=h+"."+p; return data+"."+sign(data); }
 public Optional<String> validateAndGetSubject(String token) { try { String[] a=token.split("\\."); if(a.length!=3||!MessageDigestSafe.equal(sign(a[0]+"."+a[1]),a[2])) return Optional.empty(); String payload=new String(Base64.getUrlDecoder().decode(a[1]),StandardCharsets.UTF_8); java.util.regex.Matcher sub=java.util.regex.Pattern.compile("\\\"sub\\\":\\\"([^\\\"]+)\\\"").matcher(payload); java.util.regex.Matcher exp=java.util.regex.Pattern.compile("\\\"exp\\\":(\\d+)").matcher(payload); if(!sub.find()||!exp.find()||Long.parseLong(exp.group(1))<Instant.now().getEpochSecond()) return Optional.empty(); return Optional.of(sub.group(1)); } catch(Exception e) { return Optional.empty(); } }
 private String sign(String v) { try { Mac m=Mac.getInstance("HmacSHA256"); m.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),"HmacSHA256")); return Base64.getUrlEncoder().withoutPadding().encodeToString(m.doFinal(v.getBytes(StandardCharsets.UTF_8))); } catch(Exception e) { throw new IllegalStateException(e); } }
 private String enc(String v) { return Base64.getUrlEncoder().withoutPadding().encodeToString(v.getBytes(StandardCharsets.UTF_8)); }
 private static class MessageDigestSafe { static boolean equal(String a,String b) { return java.security.MessageDigest.isEqual(a.getBytes(StandardCharsets.UTF_8),b.getBytes(StandardCharsets.UTF_8)); } }
}
