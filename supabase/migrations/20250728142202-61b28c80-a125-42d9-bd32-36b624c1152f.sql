-- Inserir 5 utilizadores com nível 'parceiro'
INSERT INTO public.users (id, nome, email, telefone, empresa, estado, perfil, parceiro_id, tipo) VALUES
('11111111-1111-1111-1111-111111111111', 'João Silva', 'joao@empresa1.pt', '+351 912 345 671', 'Empresa Alpha', 'Ativo', 'parceiro', '11111111-1111-1111-1111-111111111111', 'utilizador'),
('22222222-2222-2222-2222-222222222222', 'Maria Santos', 'maria@empresa2.pt', '+351 912 345 672', 'Empresa Beta', 'Ativo', 'parceiro', '22222222-2222-2222-2222-222222222222', 'utilizador'),
('33333333-3333-3333-3333-333333333333', 'Carlos Pereira', 'carlos@empresa3.pt', '+351 912 345 673', 'Empresa Gamma', 'Ativo', 'parceiro', '33333333-3333-3333-3333-333333333333', 'utilizador'),
('44444444-4444-4444-4444-444444444444', 'Ana Costa', 'ana@empresa4.pt', '+351 912 345 674', 'Empresa Delta', 'Ativo', 'parceiro', '44444444-4444-4444-4444-444444444444', 'utilizador'),
('55555555-5555-5555-5555-555555555555', 'Pedro Oliveira', 'pedro@empresa5.pt', '+351 912 345 675', 'Empresa Epsilon', 'Ativo', 'parceiro', '55555555-5555-5555-5555-555555555555', 'utilizador');