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
container.registerSingleton('some-class2', SomeClass2)
// Somewhere...
const instance2: ISomeClass2 = container.get<ISomeClass2>('some-class2')
```

Use aliases if it needed by setting pair register key and new alias
```ts
container.register('filesystem', SomeFileSystemClass, {aliases: ['filesystem', 'same-fs']})

// Or set it up after register like this
container.aliases('fs', ['filesystem', 'same-fs'])

container.get('fs') === container.get('filesystem') === container.get('same-fs') // true
```

Register singletons
```ts
const filesystem = Symbol() as DiContainerKey<IFileSystem>

container.registerSingleton(filesystem, SomeFileSystemClass)

const SomeClassInstance: IFileSystem = container.get(filesystem) // It's autotyped for IFileSystem becouse of Symbol key
const SomeClassInstance2: IFileSystem = container.get(filesystem) // It's autotyped for IFileSystem becouse of Symbol key

SomeClassInstance === SomeClassInstance2 // true
```
Or register classes
```ts
// Use Symbols keys for auto typing result like or just strings
const superRemoteClass = Symbol() as DiContainerKey<ISuperRemoteClass>

container.registerClass(superRemoteClass, SuperRemoteClass)

const remote: ISuperRemoteClass = container.get(superRemoteClass, ...contructorArgs) // It's autotyped for ISuperRemoteClass
const remote2: ISuperRemoteClass = container.get(superRemoteClass, ...contructorArgs) // other instance of this class
const remote3: ISuperRemoteClass = container.get(superRemoteClass, ...contructorArgs) // another instance of this class
```
Or register functions
```ts
container.registerFunction('resource', (type, ...data) => {
    return SomeFactory.get(type, data)
})

const one: FactoredOne = container.get<FactoredOne>('resource', 'one', someData)
const second: FactoredSecond = container.get<FactoredSecond>('resource', 'second', someData)
const third: FactoredThird = container.get<FactoredThird>('resource', 'third', someData)

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

## Develop

1. `npm run dev`
1. `npm run build`
1. `npm run test`
