-- Payments table schema
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(255) PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    merchant_id VARCHAR(255) NOT NULL,
    customer_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_merchant_id (merchant_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Payment status enum values
-- pending, processing, completed, failed, cancelled

-- Sample data (optional)
-- INSERT INTO payments (id, amount, currency, status, merchant_id, customer_id) 
-- VALUES 
--     ('pay_001', 100.00, 'USD', 'completed', 'merchant_001', 'customer_001'),
--     ('pay_002', 250.50, 'EUR', 'pending', 'merchant_002', 'customer_002'); 