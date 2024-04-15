import { useReducer } from 'react'

type FormAction<FormData> = {
  type: 'update'
  payload: Partial<FormData>
}

const formReducer = <T>(state: T, action: FormAction<T>): T => {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export const useFormState = <T>(initialState: T) => {
  const [state, update] = useReducer(formReducer, initialState)
  return [
    state as T,
    (updatedFields: Partial<T>) => update({ type: 'update', payload: updatedFields }),
  ] as const
}
