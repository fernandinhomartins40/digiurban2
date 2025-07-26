-- =====================================================
-- 01_auth_setup.sql
-- Configuração inicial de autenticação do Supabase
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Configurar políticas de senha
ALTER SYSTEM SET password_encryption = 'scram-sha-256';

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Função para gerar código único
CREATE OR REPLACE FUNCTION generate_unique_code(table_name TEXT, column_name TEXT, prefix TEXT DEFAULT '', length INTEGER DEFAULT 8)
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        new_code := prefix || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR length));
        
        EXECUTE FORMAT('SELECT COUNT(*) FROM %I WHERE %I = $1', table_name, column_name) 
        INTO exists_check 
        USING new_code;
        
        IF exists_check = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;