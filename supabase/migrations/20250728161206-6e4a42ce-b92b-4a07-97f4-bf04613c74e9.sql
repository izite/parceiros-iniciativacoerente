-- Criar tabela para mensagens de chat dos pedidos
CREATE TABLE public.mensagens_chat (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id uuid NOT NULL,
  conteudo text NOT NULL,
  remetente text NOT NULL CHECK (remetente IN ('user', 'system')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  autor_id uuid NOT NULL,
  CONSTRAINT mensagens_chat_pedido_id_fkey 
    FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON DELETE CASCADE
);

-- Criar tabela para documentos anexados nos chats
CREATE TABLE public.documentos_chat (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id uuid NOT NULL,
  nome_arquivo text NOT NULL,
  caminho_arquivo text NOT NULL,
  tipo_arquivo text NOT NULL,
  tamanho_arquivo bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  autor_id uuid NOT NULL,
  CONSTRAINT documentos_chat_pedido_id_fkey 
    FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON DELETE CASCADE
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.mensagens_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_chat ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para mensagens_chat
CREATE POLICY "Leitura de mensagens por utilizadores do pedido" 
ON public.mensagens_chat FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.pedidos 
    WHERE id = pedido_id AND autor_id = auth.uid()
  )
);

CREATE POLICY "Inserir mensagens nos próprios pedidos" 
ON public.mensagens_chat FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  autor_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.pedidos 
    WHERE id = pedido_id AND autor_id = auth.uid()
  )
);

-- Políticas RLS para documentos_chat
CREATE POLICY "Leitura de documentos por utilizadores do pedido" 
ON public.documentos_chat FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.pedidos 
    WHERE id = pedido_id AND autor_id = auth.uid()
  )
);

CREATE POLICY "Inserir documentos nos próprios pedidos" 
ON public.documentos_chat FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  autor_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.pedidos 
    WHERE id = pedido_id AND autor_id = auth.uid()
  )
);

-- Criar índices para melhor performance
CREATE INDEX idx_mensagens_chat_pedido_id ON public.mensagens_chat(pedido_id);
CREATE INDEX idx_mensagens_chat_created_at ON public.mensagens_chat(created_at);
CREATE INDEX idx_documentos_chat_pedido_id ON public.documentos_chat(pedido_id);
CREATE INDEX idx_documentos_chat_created_at ON public.documentos_chat(created_at);