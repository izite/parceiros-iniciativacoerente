-- Verificar valores atuais de tipo
SELECT DISTINCT tipo FROM public.users WHERE tipo IS NOT NULL;

-- Atualizar registos existentes para valores válidos
UPDATE public.users SET tipo = 'funcionario' WHERE tipo NOT IN ('funcionario', 'parceiro', 'comercial', 'cliente');

-- Agora adicionar a constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_tipo_check;
ALTER TABLE public.users ADD CONSTRAINT users_tipo_check 
CHECK (tipo IN ('funcionario', 'parceiro', 'comercial', 'cliente'));

-- Adicionar constraint para role se não existir
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check 
CHECK (role IN ('backoffice', 'parceiro', 'comercial') OR role IS NULL);

-- Inserir utilizadores de teste
INSERT INTO public.users (id, email, nome, telefone, empresa, estado, tipo, role, created_at) VALUES
-- Backoffice (acesso total)
('11111111-1111-1111-1111-111111111111', 'backoffice@teste.com', 'Admin Backoffice', '912345678', 'Empresa Central', 'Ativo', 'funcionario', 'backoffice', now()),

-- Parceiro (vê contratos dos seus comerciais)
('22222222-2222-2222-2222-222222222222', 'parceiro@teste.com', 'João Parceiro', '913456789', 'Parceiro ABC', 'Ativo', 'parceiro', 'parceiro', now()),

-- Comercial (vê apenas os seus contratos)
('33333333-3333-3333-3333-333333333333', 'comercial@teste.com', 'Maria Comercial', '914567890', 'Parceiro ABC', 'Ativo', 'comercial', 'comercial', now())
ON CONFLICT (email) DO UPDATE SET 
  nome = EXCLUDED.nome,
  telefone = EXCLUDED.telefone,
  empresa = EXCLUDED.empresa,
  tipo = EXCLUDED.tipo,
  role = EXCLUDED.role;

-- Associar comercial ao parceiro
UPDATE public.users 
SET parceiro_id = '22222222-2222-2222-2222-222222222222' 
WHERE email = 'comercial@teste.com';

-- Inserir contratos de teste
INSERT INTO public.contratos (id, nif, cliente_nome, cpe_cui, fornecedor, estado, inicio_fornecimento, consumo, comissao, autor_id, created_at) VALUES
-- Contrato do comercial (será visível para comercial e parceiro)
('44444444-4444-4444-4444-444444444444', '123456789', 'Cliente Comercial', 'PT0001234567890123456789001', 'EDP Comercial', 'Ativo', '2024-01-15', 1000, 50, (SELECT id FROM public.users WHERE email = 'comercial@teste.com'), now()),

-- Contrato do parceiro (visível para parceiro e backoffice)
('55555555-5555-5555-5555-555555555555', '987654321', 'Cliente Parceiro', 'PT0001234567890123456789002', 'Endesa', 'Ativo', '2024-01-20', 2000, 100, (SELECT id FROM public.users WHERE email = 'parceiro@teste.com'), now()),

-- Contrato do backoffice (visível apenas para backoffice)
('66666666-6666-6666-6666-666666666666', '555666777', 'Cliente Backoffice', 'PT0001234567890123456789003', 'Galp Power', 'Pendente', '2024-02-01', 1500, 75, (SELECT id FROM public.users WHERE email = 'backoffice@teste.com'), now())
ON CONFLICT (id) DO NOTHING;