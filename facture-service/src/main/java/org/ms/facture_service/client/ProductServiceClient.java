package org.ms.facture_service.client;

import org.ms.facture_service.dto.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "PRODUCT-SERVICE", fallback = ProductServiceClientFallback.class)
public interface ProductServiceClient {
    
    @GetMapping("/api/products/{id}")
    ProductDTO getProduct(@PathVariable Long id);
    
    @PutMapping("/api/products/{id}/quantity")
    void updateProductQuantity(@PathVariable Long id, @RequestBody long newQuantity);
    
    @GetMapping("/api/products/{id}/check-availability")
    boolean checkProductAvailability(@PathVariable Long id, @RequestParam long quantity);
}
