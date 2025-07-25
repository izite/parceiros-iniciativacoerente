import { createContext, useContext, useState } from "react"

export type Contact = {
  id: string
  name: string
  email: string
  phone: string
  empresa: string
  createdAt: Date
}

type ContactsContextType = {
  contacts: Contact[]
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void
  updateContact: (id: string, updates: Partial<Contact>) => void
  deleteContact: (id: string) => void
  getContact: (id: string) => Contact | undefined
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined)

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([])

  const addContact = (newContact: Omit<Contact, 'id' | 'createdAt'>) => {
    const contact: Contact = {
      ...newContact,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    }
    setContacts(prev => [...prev, contact])
  }

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ))
  }

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id))
  }

  const getContact = (id: string) => {
    return contacts.find(contact => contact.id === id)
  }

  return (
    <ContactsContext.Provider value={{ contacts, addContact, updateContact, deleteContact, getContact }}>
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