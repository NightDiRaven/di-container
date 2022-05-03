# DI container

It's very simple DI Container without injection into class with meta-data with typesript

Injection into object param through proxy

## Install

```sh
 cnpm i @umecode/di-container -S
```

```sh
 npm i @umecode/di-container --save
```

```sh
 yarn add @umecode/di-container
```

## API
#### Container
```
constructor({injectPrefix?: string = '$'})
register(name: ContainerName<T>, (Proxy<params>) => any, options: RegistrationOptions)
get(name: ContainerName<T>, params?: Record<string, any>)
inject(value: (Proxy<params>) => T, params?: Record<string, any>): T 
unregister(name: ContainerName<T>)
```
#### type ContainerName
```ts
containerName<ReturnType, ParametersType> = string | symbol<ReturnType, ParametersType>
```
#### type RegistrationOptions
```
{
  singleton?: boolean = false, //On first get it will stored and after return stored value
  aliases?: Iterable<string | Symbol<T>>, //Any aliases for get
  inject?: boolean = true, // If true, container will try map params name to registered items
  params?: Record<string, any> //this object will pass into class constructor or function call, ignored for other value types
}
```

## Usage

Create container
```ts
import { Container, ContainerName } from '@umecode/di-container'

const container = new Container()
```

You can use Symbols or strings as keys, but only with Symbols result will auto typed
```ts
// Use Symbols keys for auto typing result
const someKey = Symbol() as ContainerName<ISomeClass>

container.register(someKey, () => new SomeClass())
// Somewhere...
const instance: ISomeClass = container.get(someKey) // It's autotyped for ISomeClass becouse of Symbol key

// Or use string keys but return type need set manually
container.register('something', () => 'anything')
// Somewhere...
const test: string = container.get<string>('something') // anything
```
Typing callback params into symbol name
```ts
// Use Symbols keys for auto typing result
const someKey = Symbol() as ContainerName<ISomeClass, {name: string, service?: ISomeService}>

container.register(someKey, (params: {name: string, service?: ISomeService}) => new SomeClass(params))
// Somewhere...
const instance: ISomeClass = container.get(someKey, {name: '222'}) // It's autotyped for ISomeClass and for params type too

```

Register as singletons
```ts
const filesystem = Symbol() as ContainerName<IFileSystem>

container.register(filesystem, () => new SomeFileSystemClass(), {singleton: true})

const SomeClassInstance: IFileSystem = container.get(filesystem)
const SomeClassInstance2: IFileSystem = container.get(filesystem)

SomeClassInstance === SomeClassInstance2 // true
```
Inject by params keys
Proxy(params) allow get by keys registered containers from params object

```ts
import {Container, ContainerKey} from '@umecode/di-container'

const container = new Container()

const key = Symbol() as ContainerKey<ISomeClass>
// Register anything with string keys or aliases
container.register(key, params => new SomeClass(), {aliases:['someClass']})
container.register('someClass2', params => new SomeClass2())

// Manual inject into param functions
// Params object is Proxy on params with getters for someClass and someClass2:
const res = container.inject(({someClass: ISomeClass}) => {
  // someClass is container.get('someClass')
})

const res2 = container.inject(({someClass: ISomeClass, ...other}) => {
  // someClass is container.get('someClass')
  // other is {param1: '1', param2: 2}
}, {param1: '1', param2: 2})

// Auto inject into param functions will be for any container.get()

class TestClass {
  constructor({}: {someClass: ISomeClass, someClass2: ISomeClass2}) {
    
  }
}

const test = container.inject(params => new TestClass(params))
// Same as const test: TestClass = new TestClass({someClass: new SomeClass(), someClass2: new SomeClass2()})

// If you use only Symbol keys it can be like this
const test2 = container.inject(params => new TestClass(params), {someClass: key})
// Same as const test2: TestClass = new TestClass({someClass: container.get(key), someClass2: new SomeClass2()})

// Or you can register TestClass too
container.register('testClass', params => TestClass(params))

const test3 = container.get<TestClass>('testClass')
// Same as const test3: TestClass = new TestClass({someClass: new SomeClass(), someClass2: new SomeClass2()})

```
You can set up injectPrefix for props

```ts
const container = new Container({injectPrefix: '$'})
  
...

class Test {
  constructor({$service, service}: {$service: SomeService, service: number[]}) {
  }
}

const test = container.inject(params => new Test(params), {service: [1, 2, 3, 4]})
// const test: Test = new Test({$service: container.get('service'), service: [1, 2, 3, 4]})

```
Be careful: It can be unhandled (you need handle it manually) `RangeError` circular throw error, if you call circular injection like this
```ts
class SomeClass {
  constructor({prop}: {prop: SomeClass}) {}
}

```

## Develop

1. `npm run dev`
1. `npm run build`
1. `npm run test`
