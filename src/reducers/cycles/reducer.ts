import { produce } from 'immer'
import { ActionTypes } from './actions'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CycleState {
  cycles: Cycle[]
  currentCycleId: string | null
}

export function cyclesReducer(state: CycleState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, draft => {
        draft.cycles.push(action.payload.newCycle)
        draft.currentCycleId = action.payload.newCycle.id
      })
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      const currentCycleIndex = state.cycles.findIndex(
        cycle => cycle.id === state.currentCycleId,
      )

      if (currentCycleIndex < 0) return state

      return produce(state, draft => {
        draft.cycles[currentCycleIndex].finishedDate = new Date()
        draft.currentCycleId = null
      })
    }
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      const currentCycleIndex = state.cycles.findIndex(
        cycle => cycle.id === state.currentCycleId,
      )

      if (currentCycleIndex < 0) return state

      return produce(state, draft => {
        draft.cycles[currentCycleIndex].interruptedDate = new Date()
        draft.currentCycleId = null
      })
    }
    default:
      return state
  }
}
