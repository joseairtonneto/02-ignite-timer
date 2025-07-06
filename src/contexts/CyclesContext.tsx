import { createContext, useEffect, useReducer, useState, type ReactNode } from 'react'
import { cyclesReducer, type Cycle } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'

interface CreateCycleData {
  task: string
  minutesAmount: number
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
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      currentCycleId: null,
    },
    initialState => {
      const storagedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')

      if (storagedStateAsJSON) {
        return JSON.parse(storagedStateAsJSON)
      }

      return initialState
    },
  )

  const { cycles, currentCycleId } = cyclesState
  const currentCycle = cycles.find(cycle => cycle.id === currentCycleId)

  const [amountSecondPassed, setAmountSecondPassed] = useState(() => {
    if (currentCycle) return differenceInSeconds(new Date(), new Date(currentCycle.startDate))

    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  function setSecondsPassed(seconds: number) {
    setAmountSecondPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())

    setAmountSecondPassed(0)
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      ...data,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

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
