package com.taha.backendservice.repository;

import java.util.List;
import com.taha.backendservice.model.db.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository {
    User save(User user);
    List<User> saveAll(List<User> users);
    User find(String id);
    List<User> findAll(List<String> ids);
    List<User> findAll();
    long count();
    long delete(String id);
    long deleteAll(List<String> ids);
    long deleteAll();
    User update(User user);
    long update(List<User> users);
}
