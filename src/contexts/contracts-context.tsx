import { createContext, useContext, useState } from "react"

export type Contract = {
  id: string
  nif: string
  cliente: string
  ponto: string
  fornecedor: string
  estado: string
  inicioForn: string
  consumo: string
  comissao: string
  subUtilizador: string
}

type ContractsContextType = {
  contracts: Contract[]
  addContract: (contract: Omit<Contract, 'id'>) => void
  updateContract: (id: string, updates: Partial<Contract>) => void
}

const ContractsContext = createContext<ContractsContextType | undefined>(undefined)

export function ContractsProvider({ children }: { children: React.ReactNode }) {
  const [contracts, setContracts] = useState<Contract[]>([])

  const addContract = (newContract: Omit<Contract, 'id'>) => {
    const newId = (220000 + contracts.length).toString()
    const contract: Contract = {
      ...newContract,
      id: newId
    }
    setContracts(prev => [...prev, contract])
  }

  const updateContract = (id: string, updates: Partial<Contract>) => {
    setContracts(prev => prev.map(contract => 
      contract.id === id ? { ...contract, ...updates } : contract
    ))
  }

  return (
    <ContractsContext.Provider value={{ contracts, addContract, updateContract }}>
      {children}
    </ContractsContext.Provider>
  )
}

export function useContracts() {
  const context = useContext(ContractsContext)
  if (context === undefined) {
    throw new Error("useContracts must be used within a ContractsProvider")
  }
  return context
}