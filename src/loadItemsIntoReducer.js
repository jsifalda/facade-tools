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
        if (typeof instance[method] !== 'function') {
          throw new Error(`Facade is missing method ${method}`)
        }

        let arg = null
        const keypath = methods[method]
        if (typeof keypath === 'function') {
          arg = keypath(payload)
        } else {
          arg = get(payload, keypath)
        }

        return instance[method](arg)
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
