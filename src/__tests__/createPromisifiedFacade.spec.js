import createPromisifiedFacade from '../createPromisifiedFacade'

describe('createPromisifiedFacade', function() {
  it('appends pending property into initial state', () => {
    const initialState = {
      anotherValue: 'value'
    }
    const facade = createPromisifiedFacade((mergeWith) => {
      return {}
    }, initialState)
    const result = facade().get()
    expect(result.anotherValue).toBe(initialState.anotherValue)
    expect(result.pending).toBeDefined()
    expect(result.pending).toBe(false)
  })

  it('created startLoading and finishLoading methods on facade', () => {
    const facade = createPromisifiedFacade((mergeWith) => {
      return {}
    })
    expect(facade().startLoading).toBeInstanceOf(Function)
    expect(facade().finishLoading).toBeInstanceOf(Function)
  })

  it('updates pending state with start and finish loading properties', () => {
    const facade = createPromisifiedFacade((mergeWith) => {
      return {}
    })
    const instance = facade()
    instance.startLoading()
    expect(instance.get().pending).toBe(true)
    instance.finishLoading()
    expect(instance.get().pending).toBe(false)
  })
})
