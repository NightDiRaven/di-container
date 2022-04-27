import type {
  DIContainerInterface,
  DIContainerKey,
  Registration,
  RegistrationFactory,
  RegistrationFunction,
  RegistrationSingleton, RegistrationValue,
} from './types'

export enum RegistrationType {
  FACTORY = 'FACTORY',
  FUNCTION = 'FUNCTION',
  SINGLETON = 'SINGLETON',
  VALUE = 'VALUE',
}

class DIContainer implements DIContainerInterface {
  private registrations: Map<string | DIContainerKey<any>, Registration>
  private aliases: Map<string | DIContainerKey<any>, string | DIContainerKey<any>>

  constructor() {
    this.registrations = new Map()
    this.aliases = new Map()
  }

  registerSingleton(name: string | DIContainerKey<any>, classConstructor: any, ...args : any[]) {
    const registration: RegistrationSingleton<InstanceType<typeof classConstructor>> = {
      type: RegistrationType.SINGLETON,
      ClassDeclaration: classConstructor,
      args,
    }

    this.registrations.set(name, registration)
  }

  registerClass(name: string | DIContainerKey<any>, classConstructor: any) {
    const registration: RegistrationFactory<InstanceType<typeof classConstructor>> = {
      type: RegistrationType.FACTORY,
      ClassDeclaration: classConstructor,
    }

    this.registrations.set(name, registration)
  }

  registerFunction(name: string | DIContainerKey<any>, functionFactory: (...args: any[]) => any) {
    const registration: RegistrationFunction<ReturnType<typeof functionFactory>> = {
      type: RegistrationType.FUNCTION,
      executor: functionFactory,
    }

    this.registrations.set(name, registration)
  }

  registerValue(name: string | DIContainerKey<any>, value: any) {
    const registration: RegistrationValue = {
      type: RegistrationType.VALUE,
      value,
    }

    this.registrations.set(name, registration)
  }

  alias(name: string | DIContainerKey<any>, alias: string | DIContainerKey<any>) {
    if (!this.registrations.has(name))
      throw new Error(`Doesnt have registered container with name ${String(name)}`)

    this.aliases.set(alias, name)
  }

  get<T>(name: string | DIContainerKey<T>, args?: any[]): T {
    const registration = this.registrations.get(this.getName(name)) as Registration

    switch (registration.type) {
      case RegistrationType.FACTORY: {
        const factory: RegistrationFactory<T> = (registration as RegistrationFactory<T>)
        return new factory.ClassDeclaration(...(args ?? []))
      }

      case RegistrationType.FUNCTION: {
        const func: RegistrationFunction<T> = (registration as RegistrationFunction<T>)
        return func.executor(...(args ?? []))
      }

      case RegistrationType.SINGLETON: {
        const singleton: RegistrationSingleton<T> = (registration as RegistrationSingleton<T>)
        if (!singleton.instance)
          singleton.instance = new singleton.ClassDeclaration(...singleton.args)

        return singleton.instance
      }

      case RegistrationType.VALUE: {
        return (registration as RegistrationValue).value
      }
      default:
        throw new Error(`Unknown type${registration.type}`)
    }
  }

  private getName(nameOrAlias: string | DIContainerKey<any>): string | DIContainerKey<any> {
    if (this.registrations.has(nameOrAlias))
      return nameOrAlias

    const name = this.aliases.get(nameOrAlias)
    if (!name)
      throw new Error('Does not has registered name or alias in container')

    return name
  }
}

export default DIContainer
