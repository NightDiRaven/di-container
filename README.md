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
#### DIContainer
```
constructor({injectPrefix?: string = '$'})
register(name: string | Symbol<T>, value: class | function | any, options: RegistrationOptions)
get(name: string | Symbol<T>, params?: Record<string, any>)
inject(value: Class | Function, params?: Record<string, any>): new Class(Proxy(params)) | ReturnType<function(Proxy(params))> 
unregister(name: string | Symbol<T>)
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
import { DIContainer, DiContainerKey } from '@umecode/di-container'

const container = new DIContainer()
```

You can use Symbols or strings as keys, but only with Symbols result will autotyped
```ts
// Use Symbols keys for auto typing result
const SomeClassKey = Symbol() as DiContainerKey<ISomeClass>

container.register(SomeClassKey, SomeClass)
// Somewhere...
const instance: ISomeClass = container.get(SomeClassKey) // It's autotyped for ISomeClass becouse of Symbol key

// Or use string keys but return type need set manually
container.register('some-class2', SomeClass2)
// Somewhere...
const instance2: ISomeClass2 = container.get<ISomeClass2>('some-class2')
```

Register classes
```ts
// Use Symbols keys for auto typing result like or just strings
const superRemoteClass = Symbol() as DiContainerKey<ISuperRemoteClass>

container.register(superRemoteClass, SuperRemoteClass, {params: baseArgObject})

const remote2: ISuperRemoteClass = container.get(superRemoteClass) // other instance of this class
const remote3: ISuperRemoteClass = container.get(superRemoteClass) // another instance of this class
const remote: ISuperRemoteClass = container.get(superRemoteClass, contructorArgObject)
// Same as const remote: ISuperRemoteClass = new SuperRemoteClass({...baseArgObject, ...contructorArgObject)
```
Or register functions
```ts
container.register('resource', ({type}) => {
    return SomeFactory.get(type)
})

const one: FactoredOne = container.get<FactoredOne>('resource', {type: 'first'})
const second: FactoredSecond = container.get<FactoredSecond>('resource', {type: 'second'})
const third: FactoredThird = container.get<FactoredThird>('resource', {type: 'third'})

```
Or register values
```ts

interface Config {
    url: string
}

container.registerValue('config', Object.freeze({
    url: 'testUrl'
}))

const config: Config = container.get<Config>('config')
```
Register classes or functions as singletons
```ts
const filesystem = Symbol() as DiContainerKey<IFileSystem>

container.register(filesystem, SomeFileSystemClass, {singleton: true})

const SomeClassInstance: IFileSystem = container.get(filesystem) // It's autotyped for IFileSystem becouse of Symbol key
const SomeClassInstance2: IFileSystem = container.get(filesystem) // It's autotyped for IFileSystem becouse of Symbol key

SomeClassInstance === SomeClassInstance2 // true
```
Inject by params keys
Proxy(params) allow get by keys registered containers from params object

```ts
import {DIContainer, DiContainerKey} from '@umecode/di-container'

const container = new DIContainer()

const key = Symbol() as DiContainerKey<ISomeClass>
// Register anything with string keys or aliases
container.register(key, SomeClass, {aliases:['someClass']})
container.register('someClass2', SomeClass2)

class TestClass {
  constructor({}: {someClass: ISomeClass, someClass2: ISomeClass2}) {
    
  }
}

const test = container.inject(TestClass)
// Same as const test: TestClass = new TestClass({someClass: new SomeClass(), someClass2: new SomeClass2()})

// If you use only Symbol keys it can be like this
const test2 = container.inject(TestClass, {someClass: key})
// Same as const test2: TestClass = new TestClass({someClass: container.get(key), someClass2: new SomeClass2()})

// Or you can register TestClass too
container.register('testClass', TestClass)

const test3 = container.get<TestClass>('testClass')
// Same as const test3: TestClass = new TestClass({someClass: new SomeClass(), someClass2: new SomeClass2()})

```
You can set up injectPrefix for props

```ts
const container = new DIContainer({injectPrefix: '$'})
  
...

class Test {
  constructor({$service, service}: {$service: SomeService, service: number[]}) {
  }
}

const test = container.inject(Test, {service: [1, 2, 3, 4]})
// const test: Test = new Test({$services: container.get('services'), service: [1, 2, 3, 4]})

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
