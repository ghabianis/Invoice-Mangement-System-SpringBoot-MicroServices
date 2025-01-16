package org.ms.facture_service.controller;

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
        }
        return factureRepository.findByUsername(auth.getName());
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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Facture existingFacture = factureRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invoice not found"));
            
        // Only allow users to update their own invoices unless they're admin
        if (!auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) 
            && !existingFacture.getUsername().equals(auth.getName())) {
            throw new RuntimeException("Not authorized to update this invoice");
        }
        
        facture.setId(id);
        facture.setUsername(existingFacture.getUsername()); // Preserve original owner
        return factureRepository.save(facture);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('invoice:delete')")
    public void deleteInvoice(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Facture facture = factureRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invoice not found"));
            
        // Only allow users to delete their own invoices unless they're admin
        if (!auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) 
            && !facture.getUsername().equals(auth.getName())) {
            throw new RuntimeException("Not authorized to delete this invoice");
        }
        
        factureRepository.deleteById(id);
    }
}
