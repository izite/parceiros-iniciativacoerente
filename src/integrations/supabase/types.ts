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
        Relationships: [
          {
            foreignKeyName: "arquivos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contactos: {
        Row: {
          created_at: string | null
          created_by: string | null
          criado_por: string
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
          criado_por: string
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
          criado_por?: string
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
          {
            foreignKeyName: "contactos_criado_por_fkey"
            columns: ["criado_por"]
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
          estado: string | null
          fornecedores: string[] | null
          id: string
          mensagem: string | null
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
          estado?: string | null
          fornecedores?: string[] | null
          id?: string
          mensagem?: string | null
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
          estado?: string | null
          fornecedores?: string[] | null
          id?: string
          mensagem?: string | null
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
          {
            foreignKeyName: "pedidos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_sub_utilizador_fkey"
            columns: ["sub_utilizador"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
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
      [_ in never]: never
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
