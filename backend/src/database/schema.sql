CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER NOT NULL,
    income DECIMAL(12, 2) NOT NULL,
    dependents INTEGER NOT NULL,
    risk_tolerance VARCHAR(10) NOT NULL CHECK (risk_tolerance IN ('Low', 'Medium', 'High')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE insurance_products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_type VARCHAR(50) NOT NULL, 
    coverage_amount DECIMAL(12, 2) NOT NULL,
    term_length INTEGER, 
    monthly_premium DECIMAL(8, 2) NOT NULL,
    min_age INTEGER NOT NULL,
    max_age INTEGER NOT NULL,
    min_income DECIMAL(12, 2),
    max_income DECIMAL(12, 2),
    suitable_risk_tolerance VARCHAR(10) CHECK (suitable_risk_tolerance IN ('Low', 'Medium', 'High')),
    min_dependents INTEGER DEFAULT 0,
    max_dependents INTEGER,
    description TEXT,
    features TEXT[], 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_data_user_id ON user_data(user_id);
CREATE INDEX idx_user_data_created_at ON user_data(created_at);
CREATE INDEX idx_insurance_age_range ON insurance_products(min_age, max_age);
CREATE INDEX idx_insurance_risk_tolerance ON insurance_products(suitable_risk_tolerance);
CREATE INDEX idx_insurance_income_range ON insurance_products(min_income, max_income);

INSERT INTO insurance_products (
    product_name, product_type, coverage_amount, term_length, monthly_premium,
    min_age, max_age, min_income, max_income, suitable_risk_tolerance,
    min_dependents, max_dependents, description, features
) VALUES
('Basic Term Life 10-Year', 'Term Life', 250000, 10, 25.00, 18, 50, 30000, 75000, 'Low', 0, 2, 
 'Affordable term life insurance for young families', 
 ARRAY['Level premiums', 'Convertible to permanent', 'Renewable']),

('Standard Term Life 20-Year', 'Term Life', 500000, 20, 45.00, 25, 55, 50000, 150000, 'Medium', 1, 4, 
 'Popular 20-year term life insurance for growing families', 
 ARRAY['Level premiums', 'Convertible to permanent', 'Renewable', 'Waiver of premium']),

('Premium Term Life 30-Year', 'Term Life', 1000000, 30, 85.00, 30, 60, 100000, 500000, 'High', 2, 6, 
 'High coverage term life insurance for established families', 
 ARRAY['Level premiums', 'Convertible to permanent', 'Renewable', 'Waiver of premium', 'Accelerated death benefit']),

('Whole Life Basic', 'Whole Life', 100000, NULL, 150.00, 25, 65, 60000, 200000, 'Low', 0, 3, 
 'Permanent life insurance with cash value accumulation', 
 ARRAY['Guaranteed cash value', 'Dividend eligible', 'Tax-deferred growth', 'Loan option']),

('Whole Life Premium', 'Whole Life', 250000, NULL, 350.00, 30, 70, 100000, 400000, 'Medium', 1, 5, 
 'Enhanced whole life insurance with higher coverage', 
 ARRAY['Guaranteed cash value', 'Dividend eligible', 'Tax-deferred growth', 'Loan option', 'Paid-up additions']),

('Universal Life Flexible', 'Universal Life', 500000, NULL, 200.00, 25, 65, 75000, 300000, 'High', 1, 4, 
 'Flexible premium universal life insurance', 
 ARRAY['Flexible premiums', 'Adjustable coverage', 'Cash value growth', 'Tax advantages']),

('Young Adult Starter', 'Term Life', 150000, 15, 18.00, 18, 35, 25000, 60000, 'Low', 0, 1, 
 'Affordable starter life insurance for young adults', 
 ARRAY['Low cost', 'Convertible', 'Online application']),

('Executive Term Life', 'Term Life', 2000000, 20, 200.00, 35, 60, 200000, NULL, 'High', 2, NULL, 
 'High coverage term life for executives and high earners', 
 ARRAY['High coverage limits', 'Expedited underwriting', 'Convertible', 'Waiver of premium']),

('Estate Planning Whole Life', 'Whole Life', 1000000, NULL, 800.00, 40, 75, 300000, NULL, 'Medium', 1, NULL, 
 'Permanent life insurance for estate planning', 
 ARRAY['Estate tax benefits', 'Guaranteed cash value', 'Dividend eligible', 'Irrevocable trust compatible']);