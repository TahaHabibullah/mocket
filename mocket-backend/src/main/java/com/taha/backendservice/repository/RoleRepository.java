package com.taha.backendservice.repository;

import com.taha.backendservice.constants.ERole;
import com.taha.backendservice.model.db.Role;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository {
    Optional<Role> findByType(ERole type);
}
