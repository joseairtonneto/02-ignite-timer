import { createContext, useState, type ReactNode } from 'react'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CycleContextType {
  cycles: Cycle[]
  currentCycle: Cycle | undefined
  currentCycleId: string | null
  amountSecondPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  interruptCurrentCycle: () => void
  createNewCycle: (data: CreateCycleData) => void
}

export const CycleContext = createContext({} as CycleContextType)

interface CycleContextProviderProps {
  children: ReactNode
}

export function CycleContextProvider({ children }: CycleContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [currentCycleId, setCurrentCycleId] = useState<string | null>(null)
  const [amountSecondPassed, setAmountSecondPassed] = useState<number>(0)

  const currentCycle = cycles.find(cycle => cycle.id === currentCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    setCycles(state => {
      return state.map(cycle => {
        if (cycle.id === currentCycleId) {
          return {
            ...cycle,
            finishedDate: new Date(),
          }
        }

        return cycle
      })
    })

    setCurrentCycleId(null)
  }

  function interruptCurrentCycle() {
    setCycles(state => {
      return state.map(cycle => {
        if (cycle.id === currentCycleId) {
          return {
            ...cycle,
            interruptedDate: new Date(),
          }
        }

        return cycle
      })
    })

    setCurrentCycleId(null)
    setAmountSecondPassed(0)
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      ...data,
      startDate: new Date(),
    }

    setCycles(state => [...state, newCycle])
    setCurrentCycleId(id)
    setAmountSecondPassed(0)
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        currentCycle,
        currentCycleId,
        amountSecondPassed,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
