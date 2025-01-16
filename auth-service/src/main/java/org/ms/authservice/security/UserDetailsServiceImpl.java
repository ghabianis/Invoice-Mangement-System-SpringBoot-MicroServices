package org.ms.authservice.security;

import lombok.RequiredArgsConstructor;
import org.ms.authservice.entities.User;
import org.ms.authservice.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        // Get authorities from roles and their permissions
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .flatMap(role -> {
                    List<SimpleGrantedAuthority> auths = new ArrayList<>();
                    // Add role as authority
                    auths.add(new SimpleGrantedAuthority(role.getName().name())); // Already has ROLE_ prefix
                    // Add permissions as authorities
                    if (role.getPermissions() != null) {
                        auths.addAll(role.getPermissions().stream()
                                .map(permission -> new SimpleGrantedAuthority(permission.name()))
                                .collect(Collectors.toList()));
                    }
                    return auths.stream();
                })
                .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities);
    }
}
