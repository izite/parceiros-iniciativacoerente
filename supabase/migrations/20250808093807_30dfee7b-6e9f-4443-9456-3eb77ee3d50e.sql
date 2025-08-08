-- Add sequential ID to contratos table
ALTER TABLE public.contratos ADD COLUMN numero_id SERIAL;

-- Update existing contracts with sequential numbers starting from 1
DO $$
DECLARE
    contract_record RECORD;
    counter INTEGER := 1;
BEGIN
    FOR contract_record IN SELECT id FROM public.contratos ORDER BY created_at
    LOOP
        UPDATE public.contratos SET numero_id = counter WHERE id = contract_record.id;
        counter := counter + 1;
    END LOOP;
END $$;

-- Make numero_id NOT NULL
ALTER TABLE public.contratos ALTER COLUMN numero_id SET NOT NULL;

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