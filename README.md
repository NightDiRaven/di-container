# DI container

It's very simple DI Container without injection into class with meta-data with typesript

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

## Usage

Create container
```ts
import { DIContainer, DiContainerKey } from '@umecode/di-container'

const container = new DIContainer()
```

You can use Symbols or strings as keys, but only with Symbols result will autotyped
```ts
// Use Symbols keys for auto typing result like or string
const SomeClassKey = Symbol() as DiContainerKey<ISomeClass>

container.register(SomeClassKey, SomeClass)
// Somewhere...
const instance: ISomeClass = container.get(SomeClassKey) // It's autotyped for ISomeClass becouse of Symbol key

// Or use string keys but return type need set manually
container.register('some-class2', SomeClass2)
// Somewhere...
const instance2: ISomeClass2 = container.get<ISomeClass2>('some-class2')
```

Full example
```ts
container.register('filesystem', SomeFileSystemClass, {
  singleton: true, //Optional: On first get it will stored and after return stored value
  aliases: ['filesystem', 'same-fs'], //Optional: Any aliases for get
  params: {defaultValue: 22} //Optional: this object will pass into class constructor or function call, ignored for other value types
})

container.get('fs') === container.get('filesystem') === container.get('same-fs') // true
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

## Develop

1. `npm run dev`
1. `npm run build`
1. `npm run test`
