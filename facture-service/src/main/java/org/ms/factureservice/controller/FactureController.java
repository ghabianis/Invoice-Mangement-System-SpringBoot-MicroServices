package org.ms.factureservice.controller;

import lombok.RequiredArgsConstructor;
import org.ms.facture_service.entities.Facture;
import org.ms.facture_service.repository.FactureRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class FactureController {
    
    private final FactureRepository factureRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('invoice:read')")
    public List<Facture> getInvoices() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return factureRepository.findAll();
        } else {
            // Regular users can only see their own invoices
            return factureRepository.findByUsername(auth.getName());
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('invoice:create')")
    public Facture createInvoice(@RequestBody Facture facture) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        facture.setUsername(auth.getName());
        return factureRepository.save(facture);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('invoice:update')")
    public Facture updateInvoice(@PathVariable Long id, @RequestBody Facture facture) {
        facture.setId(id);
        return factureRepository.save(facture);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('invoice:delete')")
    public void deleteInvoice(@PathVariable Long id) {
        factureRepository.deleteById(id);
    }
}
