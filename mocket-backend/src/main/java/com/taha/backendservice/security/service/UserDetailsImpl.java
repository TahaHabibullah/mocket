package com.taha.backendservice.security.service;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.taha.backendservice.model.db.Position;
import com.taha.backendservice.model.db.User;
import org.bson.types.ObjectId;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private ObjectId id;
    private String email;
    @JsonIgnore
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private boolean verified;
    private int failedLoginAttempts;
    private boolean locked;
    private Date lockTime;

    public UserDetailsImpl(ObjectId id,
                           String email,
                           String password,
                           Collection<? extends GrantedAuthority> authorities,
                           boolean verified,
                           int failedLoginAttempts,
                           boolean locked,
                           Date lockTime) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.verified = verified;
        this.failedLoginAttempts = failedLoginAttempts;
        this.locked = locked;
        this.lockTime = lockTime;
    }

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getType().name()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                authorities,
                user.isVerified(),
                user.getFailedLoginAttempts(),
                user.isLocked(),
                user.getLockTime());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public ObjectId getId() {
        return id;
    }

    public String getEmail() { return email; }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    public boolean isVerified() { return verified; }

    public int getFailedLoginAttempts() { return failedLoginAttempts; }

    public boolean isLocked() { return locked; }

    public Date getLockTime() { return lockTime; }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
