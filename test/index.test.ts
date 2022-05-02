import {describe, expect, it, Test} from 'vitest'
import {Container, ContainerKey, ContainerName} from "../dist";


describe('should', () => {
  it('Singleton is singleton', () => {
    const container = new Container()

    interface ISingletonTest {}
    class SingletonTest implements ISingletonTest{}
    const singletonKey2 = Symbol() as ContainerName<ISingletonTest>

    container.register(singletonKey2, () => SingletonTest, {singleton: true})


    const test = container.get(singletonKey2)
    const test2 = container.get(singletonKey2)

    expect(test === test2).toEqual(true)
  })

  it('Singleton as function', () => {
    const container = new Container()

    interface ISingletonTest {}
    class SingletonTest implements ISingletonTest{}
    const singletonKey = Symbol() as ContainerName<ISingletonTest>
    container.register(singletonKey, () => new SingletonTest(), {singleton: true})
    expect(container.get(singletonKey) === container.get(singletonKey)).toEqual(true)
  })

  it('Class Factory', () => {
    const container = new Container()

    class ClassTest {
      name: string;
      constructor({name}: {name: string}) {
        this.name = name
      }
    }
    const key = Symbol() as ContainerName<ClassTest>
    container.register(key, (params: { name: string; }) => new ClassTest(params))

    expect(container.get(key, {name: 'testName'}).name === 'testName').toEqual(true)
  })

  it('Values gets okay', () => {
    const container = new Container()
    const key = Symbol() as ContainerName<string>

    container.register(key, () => 'test')
    expect(container.get(key)).toEqual('test')
  })

  it('Test aliases', () => {
    const container = new Container()
    const key = Symbol() as ContainerName<string>

    container.register(key, () => 'test', {aliases: ['test1', 'test2']})
    container.aliases(key, ['test3'])

    expect(container.get(key)).toEqual(container.get('test2'))
    expect(container.get(key)).toEqual(container.get('test3'))
  })

  it('Test unregister', () => {
    const container = new Container()
    const key = Symbol() as ContainerName<string>

    container.register(key, () => 'test', {aliases: ['test1', 'test2']})
    container.unregister(key)

    expect(() => container.get(key)).to.throw("Does not has registered name or alias in container");
  })

  it('Inject test', () => {
    const container = new Container({injectPrefix: false})
    const key = Symbol() as ContainerName<Config>

    interface Config {
      path: string,
      test: boolean
    }

    container.register(key, () => ({path: 'test-path'}), {aliases: ['config']})

    class TestClass {
      path: string
      param: string
      constructor({config, param}: {config: Config, param: string}) {
        this.path = config.path
        this.param = param
      }
    }

    container.register('testClass', (params:{config: Config, param: string}) => new TestClass(params), {singleton: true, params: {param: 44}})

    const test = container.get('testClass')
    expect(test.param === 44).toEqual(true)
    expect(test.path === 'test-path').toEqual(true)

    expect(container.inject(({config}: {config: Config}): Config => {
      return config
    }, {config: key})).toEqual(container.get(key));

    expect( container.inject((params:{config: Config, param: string}) => new TestClass(params)).path).toEqual('test-path');
  })
})
