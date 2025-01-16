package org.ms.produitservice.controller;

import lombok.RequiredArgsConstructor;
import org.ms.produitservice.entities.Produit;
import org.ms.produitservice.repository.ProduitRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
@RequiredArgsConstructor
public class ProduitController {
    
    private final ProduitRepository produitRepository;

    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public List<Produit> getAllProducts() {
        return produitRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<Produit> getProduct(@PathVariable Long id) {
        return produitRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Produit createProduct(@RequestBody Produit produit) {
        return produitRepository.save(produit);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Produit> updateProduct(@PathVariable Long id, @RequestBody Produit produit) {
        if (!produitRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        produit.setId(id);
        return ResponseEntity.ok(produitRepository.save(produit));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!produitRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        produitRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/quantity")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Produit> updateProductQuantity(@PathVariable Long id, @RequestBody long newQuantity) {
        return produitRepository.findById(id)
                .map(product -> {
                    product.setQuantity(newQuantity);
                    return ResponseEntity.ok(produitRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/check-availability")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<Boolean> checkProductAvailability(@PathVariable Long id, @RequestParam long quantity) {
        return produitRepository.findById(id)
                .map(product -> ResponseEntity.ok(product.getQuantity() >= quantity))
                .orElse(ResponseEntity.notFound().build());
    }
}
