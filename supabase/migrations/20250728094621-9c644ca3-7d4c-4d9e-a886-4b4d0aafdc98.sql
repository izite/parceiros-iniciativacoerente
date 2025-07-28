-- Primeiro vamos ver quais valores são aceitos na constraint do tipo
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.users'::regclass AND contype = 'c';

-- Remover a constraint de tipo se existir para permitir valores flexíveis
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_tipo_check;

-- Adicionar constraint mais flexível para tipo
ALTER TABLE public.users ADD CONSTRAINT users_tipo_check 
CHECK (tipo IN ('funcionario', 'parceiro', 'comercial', 'cliente'));

-- Agora inserir os utilizadores de teste
INSERT INTO public.users (id, email, nome, telefone, empresa, estado, tipo, role, created_at) VALUES
-- Backoffice (acesso total)
('11111111-1111-1111-1111-111111111111', 'backoffice@teste.com', 'Admin Backoffice', '912345678', 'Empresa Central', 'Ativo', 'funcionario', 'backoffice', now()),

-- Parceiro (vê contratos dos seus comerciais)
('22222222-2222-2222-2222-222222222222', 'parceiro@teste.com', 'João Parceiro', '913456789', 'Parceiro ABC', 'Ativo', 'parceiro', 'parceiro', now()),

-- Comercial (vê apenas os seus contratos)
('33333333-3333-3333-3333-333333333333', 'comercial@teste.com', 'Maria Comercial', '914567890', 'Parceiro ABC', 'Ativo', 'comercial', 'comercial', now())
ON CONFLICT (id) DO NOTHING;

-- Associar comercial ao parceiro
UPDATE public.users 
SET parceiro_id = '22222222-2222-2222-2222-222222222222' 
WHERE id = '33333333-3333-3333-3333-333333333333';

-- Inserir contratos de teste
INSERT INTO public.contratos (id, nif, cliente_nome, cpe_cui, fornecedor, estado, inicio_fornecimento, consumo, comissao, autor_id, created_at) VALUES
-- Contrato do comercial
('44444444-4444-4444-4444-444444444444', '123456789', 'Cliente Comercial', 'PT0001234567890123456789001', 'EDP Comercial', 'Ativo', '2024-01-15', 1000, 50, '33333333-3333-3333-3333-333333333333', now()),

-- Contrato do parceiro
('55555555-5555-5555-5555-555555555555', '987654321', 'Cliente Parceiro', 'PT0001234567890123456789002', 'Endesa', 'Ativo', '2024-01-20', 2000, 100, '22222222-2222-2222-2222-222222222222', now()),

-- Contrato do backoffice
('66666666-6666-6666-6666-666666666666', '555666777', 'Cliente Backoffice', 'PT0001234567890123456789003', 'Galp Power', 'Pendente', '2024-02-01', 1500, 75, '11111111-1111-1111-1111-111111111111', now())
ON CONFLICT (id) DO NOTHING;