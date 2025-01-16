package org.ms.authservice.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.ms.authservice.entities.ERole;
import org.ms.authservice.entities.Permission;
import org.ms.authservice.entities.Role;
import org.ms.authservice.entities.User;
import org.ms.authservice.repository.RoleRepository;
import org.ms.authservice.repository.UserRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void init() {
        // Initialize USER role with read-only permissions
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElse(new Role(ERole.ROLE_USER));
        
        Set<Permission> userPermissions = new HashSet<>(Arrays.asList(
                Permission.PRODUCT_READ,
                Permission.INVOICE_READ
        ));
        userRole.setPermissions(userPermissions);
        roleRepository.save(userRole);

        // Initialize ADMIN role with all permissions
        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElse(new Role(ERole.ROLE_ADMIN));
        
        Set<Permission> adminPermissions = new HashSet<>(Arrays.asList(
                Permission.PRODUCT_READ,
                Permission.PRODUCT_CREATE,
                Permission.PRODUCT_UPDATE,
                Permission.PRODUCT_DELETE,
                Permission.INVOICE_READ,
                Permission.INVOICE_CREATE,
                Permission.INVOICE_UPDATE,
                Permission.INVOICE_DELETE
        ));
        adminRole.setPermissions(adminPermissions);
        roleRepository.save(adminRole);

        // Create test user account if it doesn't exist
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@test.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRoles(Set.of(userRole));
            userRepository.save(user);
        }

        // Create test admin account if it doesn't exist
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@test.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
        }
    }
}
