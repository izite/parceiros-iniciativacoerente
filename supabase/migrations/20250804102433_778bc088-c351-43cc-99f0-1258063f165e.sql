-- Apagar primeiro todos os contratos para evitar violação de foreign key
DELETE FROM public.contratos;

-- Depois apagar todos os utilizadores
DELETE FROM public.users;