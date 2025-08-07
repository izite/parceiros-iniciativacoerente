export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      arquivos: {
        Row: {
          caminho_arquivo: string | null
          created_at: string | null
          criado_por: string | null
          id: string
          nome_arquivo: string | null
        }
        Insert: {
          caminho_arquivo?: string | null
          created_at?: string | null
          criado_por?: string | null
          id?: string
          nome_arquivo?: string | null
        }
        Update: {
          caminho_arquivo?: string | null
          created_at?: string | null
          criado_por?: string | null
          id?: string
          nome_arquivo?: string | null
        }
        Relationships: []
      }
      contactos: {
        Row: {
          created_at: string | null
          created_by: string | null
          criado_por: string | null
          email: string | null
          empresa: string | null
          id: string
          nif: string | null
          nome: string
          telefone: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          criado_por?: string | null
          email?: string | null
          empresa?: string | null
          id?: string
          nif?: string | null
          nome: string
          telefone?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          criado_por?: string | null
          email?: string | null
          empresa?: string | null
          id?: string
          nif?: string | null
          nome?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contactos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contratos: {
        Row: {
          autor_id: string | null
          cliente_nome: string | null
          comissao: number | null
          consumo: number | null
          cpe_cui: string | null
          created_at: string | null
          created_by: string | null
          criado_por: string | null
          estado: string | null
          fornecedor: string | null
          id: string
          inicio_fornecimento: string | null
          nif: string | null
          notas: string | null
          parceiro_id: string | null
          sub_utilizador: string | null
          tipo_energia: string | null
          tipo_preco: string | null
          user_id: string | null
        }
        Insert: {
          autor_id?: string | null
          cliente_nome?: string | null
          comissao?: number | null
          consumo?: number | null
          cpe_cui?: string | null
          created_at?: string | null
          created_by?: string | null
          criado_por?: string | null
          estado?: string | null
          fornecedor?: string | null
          id?: string
          inicio_fornecimento?: string | null
          nif?: string | null
          notas?: string | null
          parceiro_id?: string | null
          sub_utilizador?: string | null
          tipo_energia?: string | null
          tipo_preco?: string | null
          user_id?: string | null
        }
        Update: {
          autor_id?: string | null
          cliente_nome?: string | null
          comissao?: number | null
          consumo?: number | null
          cpe_cui?: string | null
          created_at?: string | null
          created_by?: string | null
          criado_por?: string | null
          estado?: string | null
          fornecedor?: string | null
          id?: string
          inicio_fornecimento?: string | null
          nif?: string | null
          notas?: string | null
          parceiro_id?: string | null
          sub_utilizador?: string | null
          tipo_energia?: string | null
          tipo_preco?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_sub_utilizador_fkey"
            columns: ["sub_utilizador"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos_chat: {
        Row: {
          autor_id: string
          caminho_arquivo: string
          created_at: string
          id: string
          nome_arquivo: string
          pedido_id: string
          tamanho_arquivo: number | null
          tipo_arquivo: string
        }
        Insert: {
          autor_id: string
          caminho_arquivo: string
          created_at?: string
          id?: string
          nome_arquivo: string
          pedido_id: string
          tamanho_arquivo?: number | null
          tipo_arquivo: string
        }
        Update: {
          autor_id?: string
          caminho_arquivo?: string
          created_at?: string
          id?: string
          nome_arquivo?: string
          pedido_id?: string
          tamanho_arquivo?: number | null
          tipo_arquivo?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_chat_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos_chat_ocorrencias: {
        Row: {
          autor_id: string
          caminho_arquivo: string
          created_at: string
          id: string
          nome_arquivo: string
          ocorrencia_id: string
          tamanho_arquivo: number | null
          tipo_arquivo: string
        }
        Insert: {
          autor_id: string
          caminho_arquivo: string
          created_at?: string
          id?: string
          nome_arquivo: string
          ocorrencia_id: string
          tamanho_arquivo?: number | null
          tipo_arquivo: string
        }
        Update: {
          autor_id?: string
          caminho_arquivo?: string
          created_at?: string
          id?: string
          nome_arquivo?: string
          ocorrencia_id?: string
          tamanho_arquivo?: number | null
          tipo_arquivo?: string
        }
        Relationships: []
      }
      mensagens_chat: {
        Row: {
          autor_id: string
          conteudo: string
          created_at: string
          id: string
          pedido_id: string
          remetente: string
        }
        Insert: {
          autor_id: string
          conteudo: string
          created_at?: string
          id?: string
          pedido_id: string
          remetente: string
        }
        Update: {
          autor_id?: string
          conteudo?: string
          created_at?: string
          id?: string
          pedido_id?: string
          remetente?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_chat_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      mensagens_chat_ocorrencias: {
        Row: {
          autor_id: string
          conteudo: string
          created_at: string
          id: string
          ocorrencia_id: string
          remetente: string
        }
        Insert: {
          autor_id: string
          conteudo: string
          created_at?: string
          id?: string
          ocorrencia_id: string
          remetente: string
        }
        Update: {
          autor_id?: string
          conteudo?: string
          created_at?: string
          id?: string
          ocorrencia_id?: string
          remetente?: string
        }
        Relationships: []
      }
      ocorrencias: {
        Row: {
          assunto: string
          autor_id: string | null
          cliente_nome: string | null
          cpe_cui: string | null
          created_at: string | null
          created_by: string | null
          criado_por: string
          descricao: string | null
          estado: string | null
          id: string
          numero_id: number
        }
        Insert: {
          assunto: string
          autor_id?: string | null
          cliente_nome?: string | null
          cpe_cui?: string | null
          created_at?: string | null
          created_by?: string | null
          criado_por: string
          descricao?: string | null
          estado?: string | null
          id?: string
          numero_id?: number
        }
        Update: {
          assunto?: string
          autor_id?: string | null
          cliente_nome?: string | null
          cpe_cui?: string | null
          created_at?: string | null
          created_by?: string | null
          criado_por?: string
          descricao?: string | null
          estado?: string | null
          id?: string
          numero_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ocorrencias_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocorrencias_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocorrencias_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          assunto: string | null
          autor_id: string | null
          categoria: string | null
          cliente_nif: string | null
          cliente_nome: string | null
          created_at: string | null
          created_by: string | null
          criado_por: string
          data_criacao: string | null
          estado: string | null
          fornecedores: string[] | null
          id: string
          mensagem: string | null
          numero_id: number
          prioridade: string | null
          sub_utilizador: string | null
        }
        Insert: {
          assunto?: string | null
          autor_id?: string | null
          categoria?: string | null
          cliente_nif?: string | null
          cliente_nome?: string | null
          created_at?: string | null
          created_by?: string | null
          criado_por: string
          data_criacao?: string | null
          estado?: string | null
          fornecedores?: string[] | null
          id?: string
          mensagem?: string | null
          numero_id?: number
          prioridade?: string | null
          sub_utilizador?: string | null
        }
        Update: {
          assunto?: string | null
          autor_id?: string | null
          categoria?: string | null
          cliente_nif?: string | null
          cliente_nome?: string | null
          created_at?: string | null
          created_by?: string | null
          criado_por?: string
          data_criacao?: string | null
          estado?: string | null
          fornecedores?: string[] | null
          id?: string
          mensagem?: string | null
          numero_id?: number
          prioridade?: string | null
          sub_utilizador?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          email: string
          empresa: string | null
          estado: string | null
          id: string
          nome: string | null
          parceiro_id: string | null
          perfil: string | null
          role: string | null
          telefone: string | null
          tipo: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          empresa?: string | null
          estado?: string | null
          id?: string
          nome?: string | null
          parceiro_id?: string | null
          perfil?: string | null
          role?: string | null
          telefone?: string | null
          tipo: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          empresa?: string | null
          estado?: string | null
          id?: string
          nome?: string | null
          parceiro_id?: string | null
          perfil?: string | null
          role?: string | null
          telefone?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_occurrence_number: {
        Args: { occurrence_id: string }
        Returns: string
      }
      get_request_number: {
        Args: { request_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
