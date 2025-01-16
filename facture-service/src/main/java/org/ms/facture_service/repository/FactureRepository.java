package org.ms.facture_service.repository;

import org.ms.facture_service.entities.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FactureRepository extends JpaRepository<Facture, Long> {
    List<Facture> findByUsername(String username);
}
