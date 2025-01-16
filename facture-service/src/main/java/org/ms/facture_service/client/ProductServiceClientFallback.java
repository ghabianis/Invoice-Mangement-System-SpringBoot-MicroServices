package org.ms.facture_service.client;

import org.ms.facture_service.dto.ProductDTO;
import org.springframework.stereotype.Component;

@Component
public class ProductServiceClientFallback implements ProductServiceClient {
    
    @Override
    public ProductDTO getProduct(Long id) {
        // Return a default product or empty product
        return new ProductDTO();
    }
    
    @Override
    public void updateProductQuantity(Long id, long newQuantity) {
        // Log the failure
        System.err.println("Failed to update product quantity. Product ID: " + id);
    }
    
    @Override
    public boolean checkProductAvailability(Long id, long quantity) {
        // Conservative approach - return false if service is down
        return false;
    }
}
