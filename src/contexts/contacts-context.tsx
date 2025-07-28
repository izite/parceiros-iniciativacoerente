import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

export type Contact = {
  id: string
  nome: string
  email?: string
  telefone?: string
  empresa?: string
  nif?: string
  criado_por?: string
  created_at?: string
}

type ContactsContextType = {
  contacts: Contact[]
  loading: boolean
  addContact: (contact: Omit<Contact, 'id' | 'created_at' | 'criado_por'>) => Promise<void>
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>
  deleteContact: (id: string) => Promise<void>
  getContact: (id: string) => Contact | undefined
  fetchContacts: () => Promise<void>
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined)

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const { data, error } = await (supabase as any)
        .from('contactos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching contacts:', error)
        return
      }

      setContacts(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addContact = async (newContact: Omit<Contact, 'id' | 'created_at' | 'criado_por'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const contactData = {
        ...newContact,
        criado_por: user?.id
      }

      const { error } = await (supabase as any)
        .from('contactos')
        .insert([contactData])

      if (error) {
        console.error('Error adding contact:', error)
        return
      }

      await fetchContacts()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const { error } = await (supabase as any)
        .from('contactos')
        .update(updates)
        .eq('id', id)

      if (error) {
        console.error('Error updating contact:', error)
        return
      }

      await fetchContacts()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteContact = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('contactos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting contact:', error)
        return
      }

      await fetchContacts()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getContact = (id: string) => {
    return contacts.find(contact => contact.id === id)
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  return (
    <ContactsContext.Provider value={{ 
      contacts, 
      loading, 
      addContact, 
      updateContact, 
      deleteContact, 
      getContact, 
      fetchContacts 
    }}>
      {children}
    </ContactsContext.Provider>
  )
}

export function useContacts() {
  const context = useContext(ContactsContext)
  if (context === undefined) {
    throw new Error("useContacts must be used within a ContactsProvider")
  }
  return context
}