import isNil from 'is-nil'

const createFacade = (builder, initialState = {}) => {
  return (state = initialState) => {
    const mergeWith = (toMerge) => {
      if (!isNil(toMerge)) {
        state = {
          ...state,
          ...(typeof toMerge === 'function' ? toMerge(state) : toMerge)
        }
      }

      return state
    }

    return {
      ...builder(mergeWith),
      get() {
        return state
      }
    }
  }
}

export default createFacade
