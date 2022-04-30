import type {ContainerName, DIContainerInterface, DIContainerKey, Registration, RegistrationConfiguration,} from './types'
import isClass from "is-class";


class DIContainer implements DIContainerInterface {
  private readonly registrations: Map<ContainerName<any>, Registration<any>>

  constructor() {
    this.registrations = new Map()
  }

  register<T>(name: string | DIContainerKey<T>, value: any, config?: RegistrationConfiguration<T>): void {
    switch (true) {
      case isClass(value):
        return this.addRegistration<T>(name, (params) => new value({...config?.params, ...params}), config)
      case typeof value === "function":
        return this.addRegistration<T>(name, (params) => value({...config?.params, ...params}), config)
      default:
        return this.addRegistration<T>(name, () => value, config)
    }
  }

  /**
   * @deprecated use register instead
   * @param name
   * @param classConstructor
   * @param params
   */
  registerSingleton(name: ContainerName<any>, classConstructor: any, params: any[]) {
    this.register(name, classConstructor, {singleton: true, params})
  }

  /**
   * @deprecated use register instead
   * @param name
   * @param classConstructor
   */
  registerClass(name: ContainerName<any>, classConstructor: any) {
    this.register(name, classConstructor)
  }

  /**
   * @deprecated use register instead
   * @param name
   * @param functionFactory
   */
  registerFunction(name: ContainerName<any>, functionFactory: (...args: any[]) => any) {
    this.register(name, functionFactory)
  }

  /**
   *
   * @deprecated use register instead
   * @param name
   * @param value
   */
  registerValue(name: ContainerName<any>, value: any) {
    this.register(name, value, {singleton: true})
  }

  aliases(name: ContainerName<any>, aliases: Iterable<ContainerName<any>>) {
    const registration = this.getRegistration(name)

    for (let alias of aliases) {
      registration.aliases.add(alias)
    }
  }

  unregister(name: ContainerName<any>) {
    this.getRegistration(name).unregister()
  }

  get<T>(name: string | DIContainerKey<T>, params?: Record<string, any>): T {
    const registration = this.getRegistration<T>(name)

    if (registration.persist) {
      if (!registration.instance) {
        registration.instance = registration.executor(params)
      }
      return registration.instance
    }

    return registration.executor(params)
  }

  private addRegistration<T>(name: string | DIContainerKey<T>, executor: (params?: Record<string, any>) => T, config?: RegistrationConfiguration<T>) {
    const registration: Registration<T> = {
      executor,
      persist: config?.singleton || false,
      aliases: new Set<ContainerName<T>>(config?.aliases),
      unregister: () => this.registrations.delete(name)
    }

    this.registrations.set(name, registration)
  }

  private getRegistration<T>(name: ContainerName<T>): Registration<T> {
    for (let [registrationName, registration] of this.registrations) {
      if (registrationName === name || registration.aliases.has(name)) {
        return  registration
      }
    }

    throw new Error('Does not has registered name or alias in container')
  }
}

export default DIContainer
