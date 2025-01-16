package org.ms.facture_service.service;

import lombok.RequiredArgsConstructor;
import org.ms.facture_service.dto.ProductDTO;
import org.ms.facture_service.client.ProductServiceClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    
    private final ProductServiceClient productServiceClient;
    
    public boolean validateAndUpdateProduct(Long productId, long quantity) {
        // Check if product exists and has enough quantity
        if (productServiceClient.checkProductAvailability(productId, quantity)) {
            // Get current product details
            ProductDTO product = productServiceClient.getProduct(productId);
            
            // Update product quantity
            long newQuantity = product.getQuantity() - quantity;
            productServiceClient.updateProductQuantity(productId, newQuantity);
            
            return true;
        }
        return false;
    }
    
    public ProductDTO getProductDetails(Long productId) {
        return productServiceClient.getProduct(productId);
    }
}
