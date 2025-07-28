-- Atualizar tabela users para ter roles mais específicos
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'comercial' CHECK (role IN ('backoffice', 'parceiro', 'comercial'));

-- Atualizar a coluna role existente para usar os novos valores
UPDATE public.users SET role = 'comercial' WHERE role IS NULL OR role NOT IN ('backoffice', 'parceiro', 'comercial');

-- Criar função para verificar se usuário é backoffice
CREATE OR REPLACE FUNCTION public.is_backoffice(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id AND role = 'backoffice'
  );
$$;

-- Criar função para verificar se usuário é parceiro
CREATE OR REPLACE FUNCTION public.is_parceiro(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id AND role = 'parceiro'
  );
$$;

-- Criar função para verificar se usuário pode ver contrato (parceiro vê contratos dos seus comerciais)
CREATE OR REPLACE FUNCTION public.can_view_contract(contract_author_id UUID, viewer_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    -- Backoffice vê tudo
    public.is_backoffice(viewer_id) OR
    -- Autor vê os seus próprios
    contract_author_id = viewer_id OR
    -- Parceiro vê contratos dos comerciais da sua organização
    (public.is_parceiro(viewer_id) AND 
     EXISTS(SELECT 1 FROM public.users WHERE id = contract_author_id AND parceiro_id = viewer_id))
$$;

-- Atualizar políticas da tabela contratos
DROP POLICY IF EXISTS "Leitura por perfil" ON public.contratos;
DROP POLICY IF EXISTS "Criação por todos os perfis" ON public.contratos;
DROP POLICY IF EXISTS "Inserir contratos" ON public.contratos;
DROP POLICY IF EXISTS "Inserir por autor" ON public.contratos;
DROP POLICY IF EXISTS " Apenas para Backoffice" ON public.contratos;
DROP POLICY IF EXISTS " Apenas para Backoffice1" ON public.contratos;

-- Nova política de leitura baseada nos níveis de permissão
CREATE POLICY "Leitura baseada em permissões" 
ON public.contratos 
FOR SELECT 
USING (public.can_view_contract(autor_id, auth.uid()));

-- Política de inserção - todos podem criar contratos
CREATE POLICY "Inserção de contratos" 
ON public.contratos 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND autor_id = auth.uid());

-- Política de atualização - apenas backoffice e autor
CREATE POLICY "Atualização de contratos" 
ON public.contratos 
FOR UPDATE 
USING (
  public.is_backoffice(auth.uid()) OR 
  autor_id = auth.uid()
);

-- Política de exclusão - apenas backoffice
CREATE POLICY "Exclusão de contratos" 
ON public.contratos 
FOR DELETE 
USING (public.is_backoffice(auth.uid()));

-- Atualizar políticas da tabela users para permitir leitura baseada em hierarquia
DROP POLICY IF EXISTS "Ler dados do próprio utilizador" ON public.users;

CREATE POLICY "Leitura de utilizadores baseada em permissões" 
ON public.users 
FOR SELECT 
USING (
  -- Próprio utilizador
  id = auth.uid() OR
  -- Backoffice vê todos
  public.is_backoffice(auth.uid()) OR
  -- Parceiro vê os seus comerciais
  (public.is_parceiro(auth.uid()) AND parceiro_id = auth.uid())
);

-- Política para atualização de utilizadores
CREATE POLICY "Atualização de utilizadores" 
ON public.users 
FOR UPDATE 
USING (
  -- Próprio utilizador pode atualizar-se
  id = auth.uid() OR
  -- Backoffice pode atualizar todos
  public.is_backoffice(auth.uid()) OR
  -- Parceiro pode atualizar os seus comerciais
  (public.is_parceiro(auth.uid()) AND parceiro_id = auth.uid())
);

-- Política para inserção de utilizadores - apenas backoffice e parceiros
CREATE POLICY "Inserção de utilizadores" 
ON public.users 
FOR INSERT 
WITH CHECK (
  public.is_backoffice(auth.uid()) OR
  public.is_parceiro(auth.uid())
);

-- Atualizar políticas de contactos para seguir a mesma lógica
DROP POLICY IF EXISTS "Leitura por autor" ON public.contactos;
DROP POLICY IF EXISTS "Inserir contactos" ON public.contactos;

CREATE POLICY "Leitura de contactos baseada em permissões" 
ON public.contactos 
FOR SELECT 
USING (
  -- Backoffice vê todos
  public.is_backoffice(auth.uid()) OR
  -- Autor vê os seus
  criado_por = auth.uid() OR
  -- Parceiro vê contactos dos seus comerciais
  (public.is_parceiro(auth.uid()) AND 
   EXISTS(SELECT 1 FROM public.users WHERE id = criado_por AND parceiro_id = auth.uid()))
);

CREATE POLICY "Inserção de contactos" 
ON public.contactos 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND criado_por = auth.uid());

CREATE POLICY "Atualização de contactos" 
ON public.contactos 
FOR UPDATE 
USING (
  public.is_backoffice(auth.uid()) OR 
  criado_por = auth.uid()
);

-- Atualizar políticas de pedidos
DROP POLICY IF EXISTS "Leitura por autor" ON public.pedidos;
DROP POLICY IF EXISTS "Inserir pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Inserir por autor" ON public.pedidos;
DROP POLICY IF EXISTS "Atualizar por autor" ON public.pedidos;
DROP POLICY IF EXISTS "Apagar por autor" ON public.pedidos;

CREATE POLICY "Leitura de pedidos baseada em permissões" 
ON public.pedidos 
FOR SELECT 
USING (
  public.is_backoffice(auth.uid()) OR
  autor_id = auth.uid() OR
  (public.is_parceiro(auth.uid()) AND 
   EXISTS(SELECT 1 FROM public.users WHERE id = autor_id AND parceiro_id = auth.uid()))
);

CREATE POLICY "Inserção de pedidos" 
ON public.pedidos 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND autor_id = auth.uid());

CREATE POLICY "Atualização de pedidos" 
ON public.pedidos 
FOR UPDATE 
USING (
  public.is_backoffice(auth.uid()) OR 
  autor_id = auth.uid()
);

-- Atualizar políticas de ocorrências
DROP POLICY IF EXISTS "Leitura por autor" ON public.ocorrencias;
DROP POLICY IF EXISTS "Inserir ocorrências" ON public.ocorrencias;
DROP POLICY IF EXISTS "Inserir por autor" ON public.ocorrencias;
DROP POLICY IF EXISTS "Atualizar ocorrência do autor" ON public.ocorrencias;
DROP POLICY IF EXISTS "Apagar ocorrência do autor" ON public.ocorrencias;

CREATE POLICY "Leitura de ocorrências baseada em permissões" 
ON public.ocorrencias 
FOR SELECT 
USING (
  public.is_backoffice(auth.uid()) OR
  autor_id = auth.uid() OR
  (public.is_parceiro(auth.uid()) AND 
   EXISTS(SELECT 1 FROM public.users WHERE id = autor_id AND parceiro_id = auth.uid()))
);

CREATE POLICY "Inserção de ocorrências" 
ON public.ocorrencias 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND autor_id = auth.uid());

CREATE POLICY "Atualização de ocorrências" 
ON public.ocorrencias 
FOR UPDATE 
USING (
  public.is_backoffice(auth.uid()) OR 
  autor_id = auth.uid()
);

-- Inserir utilizadores de teste para cada perfil
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