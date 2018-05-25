import createFacade from './createFacade'

const createPromisifiedFacade = (builder, initialState = {}) => {
  initialState = {
    pending: false,
    ...initialState
  }

  return createFacade((mergeWith) => {
    return {
      ...builder(mergeWith),
      startLoading() {
        mergeWith({ pending: true })
        return this
      },
      finishLoading() {
        mergeWith({ pending: false })
        return this
      }
    }
  }, initialState)
}

export default createPromisifiedFacade
