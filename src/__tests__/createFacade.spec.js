import createFacade from '../createFacade'

describe('createFacade', function() {
  it('it returns object with get method', () => {
    const facade = createFacade((mergeWith) => {
      return {}
    })
    expect(facade().get).toBeInstanceOf(Function)
  })

  it('returns initial state from get method', () => {
    const initState = {
      another: 'value'
    }
    const facade = createFacade((mergeWith) => {
      return {}
    }, initState)
    const result = facade().get()
    expect(result).toBe(initState)
  })

  it('merges definition into facade', () => {
    const value = 'test'
    const facade = createFacade((mergeWith) => {
      return {
        method() {
          return value
        }
      }
    })
    expect(facade().method).toBeInstanceOf(Function)
    const result = facade().method()
    expect(result).toBe(value)
  })

  it('updates facade state and returns new value', () => {
    const initState = {
      value: 'test'
    }
    const value = 'value'
    const facade = createFacade((mergeWith) => {
      return {
        method() {
          mergeWith({ another: value })
          return this
        }
      }
    }, initState)

    const result = facade()
      .method()
      .get()
    expect(result.another).toBeDefined()
    expect(result.another).toBe(value)
    expect(result.value).toBeDefined()
  })

  it('udpates facade state with modifier function', () => {
    const initState = {
      value: [1]
    }
    const newValue = 2
    const facade = createFacade((mergeWith) => {
      return {
        method() {
          mergeWith(({ value }) => {
            return {
              value: [...value, newValue]
            }
          })
          return this
        }
      }
    }, initState)
    const result = facade()
      .method()
      .get()
    expect(result.value.length).toBe(2)
    expect(result.value).toMatchObject([1, 2])
  })
})
