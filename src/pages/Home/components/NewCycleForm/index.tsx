import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'

import { CycleContext } from '../../../../contexts/CyclesContext'

import { FormContainer, MinutesAmountInput, TaskInput } from './styles'

export function NewCycleForm() {
  const { currentCycle } = useContext(CycleContext)
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor='task'>Vou trabalhar em</label>
      <TaskInput
        id='task'
        list='task-suggestions'
        placeholder='Dê um nome para o seu projeto'
        disabled={!!currentCycle}
        {...register('task')}
      />

      <datalist id='task-suggestions'>
        <option value='Teste' />
      </datalist>

      <label htmlFor='minutesAmount'>durante</label>
      <MinutesAmountInput
        id='minutesAmount'
        type='number'
        placeholder='00'
        step={5}
        min={5}
        max={60}
        disabled={!!currentCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
