package org.ms.authservice.entities;

public enum Permission {
    // Product permissions
    PRODUCT_READ("product:read"),
    PRODUCT_CREATE("product:create"),
    PRODUCT_UPDATE("product:update"),
    PRODUCT_DELETE("product:delete"),
    
    // Invoice permissions
    INVOICE_READ("invoice:read"),
    INVOICE_CREATE("invoice:create"),
    INVOICE_UPDATE("invoice:update"),
    INVOICE_DELETE("invoice:delete");

    private final String permission;

    Permission(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return permission;
    }
}
