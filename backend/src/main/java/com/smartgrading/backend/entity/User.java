package com.smartgrading.backend.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Entity @Table(name="users") @Getter @Setter @NoArgsConstructor
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="user_id") private Integer id;
 @Column(nullable=false,length=100) private String name;
 @Column(nullable=false,length=150,unique=true) private String email;
 @Column(name="password",nullable=false,length=255) private String password;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role;
 @Column(name="created_at",columnDefinition="TIMESTAMP",insertable=false,updatable=false) private LocalDateTime createdAt;
}
