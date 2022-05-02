import {describe, expect, it, Test} from 'vitest'
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

  it('Inject test', () => {
    const container = new DIContainer({injectPrefix: false})
    const key = Symbol() as DIContainerKey<Config>

    interface Config {
      path: string,
      test: boolean
    }

    container.register(key, {path: 'test-path'}, {aliases: ['config']})

    class TestClass {
      path: string
      param: string
      constructor({config, param}: {config: Config, param: string}) {
        this.path = config.path
        this.param = param
      }
    }

    container.register('testClass', TestClass, {singleton: true, params: {param: 44}})

    const test = container.get('testClass')
    expect(test.param === 44).toEqual(true)
    expect(test.path === 'test-path').toEqual(true)

    expect(container.inject<Config>(({config}: {config: Config}): Config => {
      return config
    }, {config: key})).toEqual(container.get(key));

    expect( container.inject(TestClass).path).toEqual('test-path');
  })
})
