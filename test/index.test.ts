import { describe, expect, it } from 'vitest'
import {DIContainer, DIContainerKey} from "../dist";


describe('should', () => {
  it('Singleton is singleton', () => {
    const container = new DIContainer()

    interface ISingletonTest {}
    class SingletonTest implements ISingletonTest{}
    const singletonKey = Symbol() as DIContainerKey<ISingletonTest>
    container.registerSingleton(singletonKey, SingletonTest)
    expect(container.get(singletonKey)).toEqual(container.get(singletonKey))
  })

  it('Values gets okay', () => {
    const container = new DIContainer()
    const key = Symbol() as DIContainerKey<string>

    container.registerValue(key, 'test')
    expect(container.get(key)).toEqual('test')
  })
})
