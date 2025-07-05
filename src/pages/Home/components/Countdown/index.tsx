import { CountdownContainer, Separator } from './styles'

export function Countdown() {
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
