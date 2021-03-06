import get from 'lodash.get'

const defaultActions = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
}

const loadItemsIntoReducer = (facade, methods = {}, { PENDING, FULFILLED, REJECTED } = defaultActions) => {
  return {
    [PENDING](state, { payload }) {
      const instance = facade(state)
      if (typeof instance.startLoading === 'function') {
        instance.startLoading()
      }

      return instance.get()
    },
    [FULFILLED](state, action) {
      const instance = facade(state)
      if (typeof instance.finishLoading === 'function') {
        instance.finishLoading()
      }

      Object.keys(methods || {}).map((method) => {
        if (typeof instance[method] !== 'function') {
          throw new Error(`Facade is missing method ${method}`)
        }

        let arg = null
        const keypath = methods[method]
        if (typeof keypath === 'function') {
          arg = keypath(action)
        } else {
          const { payload } = action
          arg = get(payload, keypath)
        }

        return instance[method](arg)
      })
      return instance.get()
    },
    [REJECTED](state, { payload }) {
      const instance = facade(state)
      if (typeof instance.finishLoading === 'function') {
        instance.finishLoading()
      }

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
