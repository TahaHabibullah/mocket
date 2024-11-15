package com.taha.backendservice.security.service;

import com.taha.backendservice.model.db.User;
import com.taha.backendservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String credential) throws UsernameNotFoundException {
        User user;
        if(credential.contains("@")) {
            user = userRepository.findByEmail(credential)
                    .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + credential));
        }
        else {
            user = userRepository.findById(credential)
                    .orElseThrow(() -> new UsernameNotFoundException("User Not Found with id: " + credential));
        }

        return UserDetailsImpl.build(user);
    }
}
