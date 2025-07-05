import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'

import { HandPalm, Play } from 'phosphor-react'

import { HomeContainer, StartCountdownButton, StopCountdownButton } from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [currentCycleId, setCurrentCycleId] = useState<string | null>(null)
  const [amountSecondPassed, setAmountSecondPassed] = useState<number>(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const currentCycle = cycles.find(cycle => cycle.id === currentCycleId)

  const totalSeconds = currentCycle ? currentCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (currentCycle) {
      interval = setInterval(() => {
        const secondsPassed = differenceInSeconds(new Date(), currentCycle.startDate)

        if (secondsPassed >= totalSeconds) {
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

          clearInterval(interval)
          setCurrentCycleId(null)
          setAmountSecondPassed(0)
        } else {
          setAmountSecondPassed(secondsPassed)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [currentCycle, currentCycleId, totalSeconds])

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      ...data,
      startDate: new Date(),
    }

    setCycles(state => [...state, newCycle])
    setCurrentCycleId(id)
    setAmountSecondPassed(0)

    reset()
  }

  function handleInterruptCycle() {
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

  const secondsLeft = currentCycle ? totalSeconds - amountSecondPassed : 0
  const minutesLeft = Math.floor(secondsLeft / 60)

  const minutesLeftFormatted = String(minutesLeft).padStart(2, '0')
  const secondsLeftFormatted = String(secondsLeft % 60).padStart(2, '0')

  useEffect(() => {
    if (currentCycle) document.title = `${minutesLeftFormatted}:${secondsLeftFormatted}`
    else document.title = 'Ignite Timer'
  }, [secondsLeft, minutesLeft, currentCycle])

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action=''>
        <NewCycleForm />

        <Countdown />

        {currentCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type='button'>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type='submit'>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
