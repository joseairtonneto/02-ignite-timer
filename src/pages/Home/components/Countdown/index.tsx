import { useContext, useEffect } from 'react'
import { differenceInSeconds } from 'date-fns'

import { CycleContext } from '../../../../contexts/CyclesContext'

import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    currentCycle,
    currentCycleId,
    amountSecondPassed,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  } = useContext(CycleContext)

  const totalSeconds = currentCycle ? currentCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (currentCycle) {
      interval = setInterval(() => {
        const secondsPassed = differenceInSeconds(new Date(), currentCycle.startDate)

        if (secondsPassed >= totalSeconds) {
          markCurrentCycleAsFinished()

          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsPassed)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    currentCycle,
    currentCycleId,
    totalSeconds,
    setSecondsPassed,
    markCurrentCycleAsFinished,
  ])

  const secondsLeft = currentCycle ? totalSeconds - amountSecondPassed : 0
  const minutesLeft = Math.floor(secondsLeft / 60)

  const minutesLeftFormatted = String(minutesLeft).padStart(2, '0')
  const secondsLeftFormatted = String(secondsLeft % 60).padStart(2, '0')

  useEffect(() => {
    if (currentCycle) document.title = `${minutesLeftFormatted}:${secondsLeftFormatted}`
    else document.title = 'Ignite Timer'
  }, [secondsLeft, minutesLeft, currentCycle])

  return (
    <CountdownContainer>
      <span>{minutesLeftFormatted[0]}</span>
      <span>{minutesLeftFormatted[1]}</span>
      <Separator>:</Separator>
      <span>{secondsLeftFormatted[0]}</span>
      <span>{secondsLeftFormatted[1]}</span>
    </CountdownContainer>
  )
}
