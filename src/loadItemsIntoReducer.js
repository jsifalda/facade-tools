import get from 'lodash.get'

const defaultActions = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
}

const loadItemsIntoReducer = (facade, methods = {}, { PENDING, FULFILLED, REJECTED } = defaultActions) => {
  return {
    [PENDING] (state, { payload }) {
      return facade(state)
        .startLoading()
        .get()
    },
    [FULFILLED] (state, { payload }) {
      const instance = facade(state).finishLoading()
      Object.keys(methods || {}).map((method) => {
        const keypath = methods[method]
        if (typeof instance[method] !== 'function') {
          throw new Error(`Facade is missing method ${method}`)
        }

        return instance[method](get(payload, keypath))
      })
      return instance.get()
    },
    [REJECTED] (state, { payload }) {
      const instance = facade(state).finishLoading()
      Object.keys(methods || {}).map((method) => {
        if (typeof instance[method] !== 'function') {
          throw new Error(`Facade is missing method ${method}`)
        }

        return instance[method]([])
      })

      return instance.get()
    }
  }
}

export default loadItemsIntoReducer
