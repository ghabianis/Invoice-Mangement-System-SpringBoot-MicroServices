package org.ms.produitservice;
import org.ms.produitservice.entities.Produit;
import org.ms.produitservice.repository.ProduitRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
@SpringBootApplication
public class ProduitServiceApplication {
public static void main(String[] args) {
	SpringApplication.run(ProduitServiceApplication.class, args);
	}
	@Bean
	CommandLineRunner start(ProduitRepository produitRepository, RepositoryRestConfiguration
	repositoryRestConfiguration) {
	repositoryRestConfiguration.exposeIdsFor(Produit.class);
	return args -> {
	produitRepository.save(new Produit(null, "Lait", 1350, 100));
	produitRepository.save(new Produit(null, "Pain", 230, 20));
	produitRepository.save(new Produit(null, "Yaourt", 460, 555));
	produitRepository.findAll().forEach(p -> {
	System.out.println(p.getName() + ":" + p.getPrice() + ":" + p.getQuantity());
	});
	};
	}
}