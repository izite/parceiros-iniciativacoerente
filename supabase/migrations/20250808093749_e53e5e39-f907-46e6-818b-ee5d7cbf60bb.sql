-- Add sequential ID to contratos table
ALTER TABLE public.contratos ADD COLUMN numero_id SERIAL;

-- Create sequence for contratos if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS contratos_numero_id_seq;

-- Update existing contracts with sequential numbers
UPDATE public.contratos 
SET numero_id = nextval('contratos_numero_id_seq') 
WHERE numero_id IS NULL;

-- Set the sequence to continue from the highest existing number
SELECT setval('contratos_numero_id_seq', COALESCE((SELECT MAX(numero_id) FROM public.contratos), 0));

-- Make numero_id NOT NULL and set default
ALTER TABLE public.contratos ALTER COLUMN numero_id SET NOT NULL;
ALTER TABLE public.contratos ALTER COLUMN numero_id SET DEFAULT nextval('contratos_numero_id_seq');

-- Create function to get contract number
CREATE OR REPLACE FUNCTION public.get_contract_number(contract_id uuid)
RETURNS text
LANGUAGE sql
STABLE
AS $function$
  SELECT 'CT' || LPAD(numero_id::text, 3, '0')
  FROM public.contratos
  WHERE id = contract_id;
$function$;