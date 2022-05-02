import type {ContainerName, DIContainerConfiguration, DIContainerInterface, DIContainerKey, Registration, RegistrationConfiguration,} from './types'
import isClass from "is-class";


class DIContainer implements DIContainerInterface {
  private readonly registrations: Map<ContainerName<any>, Registration<any>>
  private readonly injectPrefix: string | false

  constructor({injectPrefix = false}: DIContainerConfiguration = {}) {
    this.registrations = new Map()

    this.injectPrefix = injectPrefix
  }

  inject<T>(value: T, params?: Record<string, any>): T {
    return DIContainer.exec(value, this.injectIn({...params}))
  }

  register<T>(name: string | DIContainerKey<T>, value: any, {singleton = false, inject = true, params: base, aliases}: RegistrationConfiguration<T> = {}): void {
    if (inject) {
      this.addRegistration(name, (params) => DIContainer.exec(value, this.injectIn({...base, ...params})), {singleton, aliases})
    } else {
      this.addRegistration(name, (params) => DIContainer.exec(value, {...base, ...params}), {singleton, aliases})
    }
  }

  aliases(name: ContainerName<any>, aliases: Iterable<ContainerName<any>>) {
    const registration = this.getRegistration(name, true)

    for (let alias of aliases) {
      registration.aliases.add(alias)
    }
  }

  unregister(name: ContainerName<any>) {
    this.getRegistration(name, true).unregister()
  }

  get<T>(name: string | DIContainerKey<T>, params?: Record<string, any>): T {
    return DIContainer.getFromRegistration<T>(this.getRegistration<T>(name, true), params) as T
  }

  private static getFromRegistration<T>(registration?: Registration<T>, params?: Record<string, any>): T | undefined {
    if (!registration) {
      return undefined
    }
    if (registration.persist) {
      if (!registration.instance) {
        registration.instance = registration.executor(params)
      }
      return registration.instance
    }

    return registration.executor(params)
  }

  private addRegistration<T>(name: string | DIContainerKey<T>, executor: (params?: Record<string, any>) => T, config: RegistrationConfiguration<T>) {
    const registration: Registration<T> = {
      executor,
      persist: config?.singleton || false,
      aliases: new Set<ContainerName<T>>(config?.aliases),
      unregister: () => this.registrations.delete(name)
    }

    this.registrations.set(name, registration)
  }

  private getRegistration<T>(name: ContainerName<T>, throwError?: true): Registration<T>
  private getRegistration<T>(name: ContainerName<T>, throwError?: boolean): Registration<T> | undefined {
    for (let [registrationName, registration] of this.registrations) {
      if (registrationName === name || registration.aliases.has(name)) {
        return registration
      }
    }
    if (throwError) {
      throw new Error('Does not has registered name or alias in container')
    }
  }

  injectIn(params: Record<string | symbol, any>): ProxyHandler<typeof params> {
    return new Proxy(params, {
      get: (target, name) => {
        const value: any = target[name]
        switch (typeof name) {
          case "string": {
            let regName: string = name
            if (this.injectPrefix) {
              if (!name.startsWith(this.injectPrefix)) {
                return value
              }
              regName = name.substring(this.injectPrefix.length)
            }
            return DIContainer.getFromRegistration(this.getRegistration(regName))
              ?? DIContainer.getFromRegistration(this.getRegistration(value)) ?? value
          }
          case "symbol": {
            return DIContainer.getFromRegistration(this.getRegistration(value)) ?? value
          }
          default: {
            return value
          }
        }
      }
    })
  }

  private static exec<T>(value: any, params?: Record<string, any>): T {
    switch (true) {
      case isClass(value):
        return new value(params)
      case typeof value === "function":
        return value(params)
      default:
        return value
    }
  }
}

export default DIContainer
