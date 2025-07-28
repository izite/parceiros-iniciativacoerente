-- Remover a constraint de foreign key que está a causar o problema
ALTER TABLE public.contactos DROP CONSTRAINT IF EXISTS contactos_criado_por_fkey;

-- Tornar o campo criado_por nullable para evitar problemas futuros
ALTER TABLE public.contactos ALTER COLUMN criado_por DROP NOT NULL;