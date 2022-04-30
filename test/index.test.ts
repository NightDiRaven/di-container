import { describe, expect, it } from 'vitest'
import {DIContainer, DIContainerKey} from "../dist";


describe('should', () => {
  it('Singleton is singleton', () => {
    const container = new DIContainer()

    interface ISingletonTest {}
    class SingletonTest implements ISingletonTest{}
    const singletonKey = Symbol() as DIContainerKey<ISingletonTest>

    container.register(singletonKey, SingletonTest, {singleton: true})

    expect(container.get(singletonKey) === container.get(singletonKey)).toEqual(true)
  })

  it('Singleton as function', () => {
    const container = new DIContainer()

    interface ISingletonTest {}
    class SingletonTest implements ISingletonTest{}
    const singletonKey = Symbol() as DIContainerKey<ISingletonTest>
    container.register(singletonKey, () => new SingletonTest(), {singleton: true})
    expect(container.get(singletonKey) === container.get(singletonKey)).toEqual(true)
  })

  it('Class Factory', () => {
    const container = new DIContainer()

    class ClassTest {
      name: string;
      constructor({name}: {name: string}) {
        this.name = name
      }
    }
    const key = Symbol() as DIContainerKey<ClassTest>
    container.register(key, ClassTest)

    expect(container.get(key, {name: 'testName'}).name === 'testName').toEqual(true)
  })

  it('Values gets okay', () => {
    const container = new DIContainer()
    const key = Symbol() as DIContainerKey<string>

    container.register(key, 'test')
    expect(container.get(key)).toEqual('test')
  })

  it('Test aliases', () => {
    const container = new DIContainer()
    const key = Symbol() as DIContainerKey<string>

    container.register(key, 'test', {aliases: ['test1', 'test2']})
    container.aliases(key, ['test3'])

    expect(container.get(key)).toEqual(container.get('test2'))
    expect(container.get(key)).toEqual(container.get('test3'))
  })

  it('Test unregister', () => {
    const container = new DIContainer()
    const key = Symbol() as DIContainerKey<string>

    container.register(key, 'test', {aliases: ['test1', 'test2']})
    container.unregister(key)

    expect(() => container.get(key)).to.throw("Does not has registered name or alias in container");
  })
})
