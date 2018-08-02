import isNil from 'is-nil'

import createFacade from './createFacade'

const clearPending = (pending, id) => {
  if (!Array.isArray(pending)) {
    return []
  }

  return pending.filter((_id) => {
    return _id !== id
  })
}

const createPromisifiedFacade = (builder, initialState = {}) => {
  initialState = {
    pending: false,
    ...initialState
  }

  return createFacade((mergeWith) => {
    return {
      ...builder(mergeWith),
      startLoading(id) {
        mergeWith(({ pending }) => {
          return {
            pending: isNil(id) ? true : [...(!Array.isArray(pending) ? [] : pending), id]
          }
        })
        return this
      },
      finishLoading(id) {
        mergeWith(({ pending }) => {
          return {
            pending: isNil(id) ? false : clearPending(pending, id)
          }
        })
        return this
      }
    }
  }, initialState)
}

export default createPromisifiedFacade
