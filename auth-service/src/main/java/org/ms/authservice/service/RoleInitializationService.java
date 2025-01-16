package org.ms.authservice.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.ms.authservice.entities.ERole;
import org.ms.authservice.entities.Permission;
import org.ms.authservice.entities.Role;
import org.ms.authservice.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoleInitializationService {
    
    private final RoleRepository roleRepository;

    @PostConstruct
    public void initRoles() {
        // Initialize ADMIN role with all permissions
        if (!roleRepository.findByName(ERole.ROLE_ADMIN).isPresent()) {
            Role adminRole = new Role();
            adminRole.setName(ERole.ROLE_ADMIN);
            Set<Permission> adminPermissions = new HashSet<>();
            // Add all permissions for admin
            adminPermissions.add(Permission.PRODUCT_READ);
            adminPermissions.add(Permission.PRODUCT_CREATE);
            adminPermissions.add(Permission.PRODUCT_UPDATE);
            adminPermissions.add(Permission.PRODUCT_DELETE);
            adminPermissions.add(Permission.INVOICE_READ);
            adminPermissions.add(Permission.INVOICE_CREATE);
            adminPermissions.add(Permission.INVOICE_UPDATE);
            adminPermissions.add(Permission.INVOICE_DELETE);
            adminRole.setPermissions(adminPermissions);
            roleRepository.save(adminRole);
        }

        // Initialize USER role with restricted permissions
        if (!roleRepository.findByName(ERole.ROLE_USER).isPresent()) {
            Role userRole = new Role();
            userRole.setName(ERole.ROLE_USER);
            Set<Permission> userPermissions = new HashSet<>();
            // Add limited permissions for user
            userPermissions.add(Permission.PRODUCT_READ);
            userPermissions.add(Permission.INVOICE_READ);
            userPermissions.add(Permission.INVOICE_CREATE);
            userRole.setPermissions(userPermissions);
            roleRepository.save(userRole);
        }
    }
}
