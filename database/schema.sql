-- 1. Create Branches Table
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Roster/Employees Table
CREATE TABLE branch_employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    full_legal_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Whitelisted Corporate Accounts Table
CREATE TABLE merchant_whitelisted_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    bank_code VARCHAR(20) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    account_name VARCHAR(150) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. Create Inbound Customer Fraud Audit Reports Table
CREATE TABLE audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES branches(id),
    reporter_phone VARCHAR(20) NOT NULL,
    receipt_image_url TEXT NOT NULL,
    extracted_account_number VARCHAR(20),
    extracted_bank_name VARCHAR(100),
    geo_latitude NUMERIC(10, 7),
    geo_longitude NUMERIC(10, 7),
    geofence_verified BOOLEAN DEFAULT FALSE,
    name_similarity_score NUMERIC(5, 2),
    trust_tier VARCHAR(20) DEFAULT 'TIER_1',
    status VARCHAR(30) DEFAULT 'PENDING_REVIEW',
    bounty_amount NUMERIC(10, 2) DEFAULT 5000.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
