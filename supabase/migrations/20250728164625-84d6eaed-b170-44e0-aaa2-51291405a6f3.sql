-- Criar tabelas para mensagens e documentos do chat de ocorrências
CREATE TABLE public.mensagens_chat_ocorrencias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ocorrencia_id UUID NOT NULL,
  conteudo TEXT NOT NULL,
  remetente TEXT NOT NULL CHECK (remetente IN ('user', 'system')),
  autor_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX idx_mensagens_chat_ocorrencias_ocorrencia_id ON public.mensagens_chat_ocorrencias(ocorrencia_id);
CREATE INDEX idx_mensagens_chat_ocorrencias_created_at ON public.mensagens_chat_ocorrencias(created_at);

-- Criar tabela para documentos do chat de ocorrências
CREATE TABLE public.documentos_chat_ocorrencias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ocorrencia_id UUID NOT NULL,
  nome_arquivo TEXT NOT NULL,
  caminho_arquivo TEXT NOT NULL,
  tipo_arquivo TEXT NOT NULL,
  tamanho_arquivo BIGINT,
  autor_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX idx_documentos_chat_ocorrencias_ocorrencia_id ON public.documentos_chat_ocorrencias(ocorrencia_id);
CREATE INDEX idx_documentos_chat_ocorrencias_created_at ON public.documentos_chat_ocorrencias(created_at);

-- RLS policies para mensagens de chat de ocorrências
ALTER TABLE public.mensagens_chat_ocorrencias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura de mensagens por utilizadores da ocorrência" 
ON public.mensagens_chat_ocorrencias 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.ocorrencias 
    WHERE ocorrencias.id = mensagens_chat_ocorrencias.ocorrencia_id 
    AND ocorrencias.autor_id = auth.uid()
  )
);

CREATE POLICY "Inserir mensagens nas próprias ocorrências" 
ON public.mensagens_chat_ocorrencias 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND autor_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM public.ocorrencias 
    WHERE ocorrencias.id = mensagens_chat_ocorrencias.ocorrencia_id 
    AND ocorrencias.autor_id = auth.uid()
  )
);

-- RLS policies para documentos de chat de ocorrências
ALTER TABLE public.documentos_chat_ocorrencias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura de documentos por utilizadores da ocorrência" 
ON public.documentos_chat_ocorrencias 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.ocorrencias 
    WHERE ocorrencias.id = documentos_chat_ocorrencias.ocorrencia_id 
    AND ocorrencias.autor_id = auth.uid()
  )
);

CREATE POLICY "Inserir documentos nas próprias ocorrências" 
ON public.documentos_chat_ocorrencias 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND autor_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM public.ocorrencias 
    WHERE ocorrencias.id = documentos_chat_ocorrencias.ocorrencia_id 
    AND ocorrencias.autor_id = auth.uid()
  )
);