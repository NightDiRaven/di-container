import type {ContainerConfiguration, ContainerName, Registration, RegistrationConfiguration,} from './types'
import {RegistrationsMap} from "./types";

class Container {
  private readonly registrations: RegistrationsMap
  private readonly injectPrefix: string | false

  constructor({injectPrefix = false}: ContainerConfiguration = {}) {
    this.registrations = new Map()

    this.injectPrefix = injectPrefix
  }

  inject<T>(value: (params: Record<any, any>) => T, params?: Record<string, any>): T {
    params = Object.assign({}, params)
    return value(this.injectIn(params))
  }

  register(name: ContainerName, value: (params: any) => any, config: RegistrationConfiguration = {}): void {
    const container = this
    const registration: Registration = {
      executor(params?: Record<string | number | symbol, any>) {
        params = Object.assign({}, this.params, params)
        return value(this.inject ? container.injectIn(params) : params)
      },
      singleton: config.singleton || false,
      inject: config.inject || true,
      params: config.params,
      aliases: new Set<ContainerName>(config?.aliases),
      unregister: () => this.registrations.delete(name)
    }

    this.registrations.set(name, registration)
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

  get<T, P>(name: ContainerName<T, P>, params?: P): T {
    return Container.getFromRegistration(this.getRegistration(name, true), params) as T
  }

  private static getFromRegistration(registration?: Registration, params?: Record<string, any>) {
    if (!registration) {
      return undefined
    }
    if (registration.singleton) {
      if (!registration.instance) {
        registration.instance = registration.executor(params)
      }
      return registration.instance
    }

    return registration.executor(params) as ReturnType<typeof registration.executor>
  }

  private getRegistration(name: ContainerName, throwError?: true): Registration
  private getRegistration(name: ContainerName, throwError?: boolean): Registration | undefined {
    for (let [registrationName, registration] of this.registrations) {
      if (registrationName === name || registration.aliases.has(name)) {
        return registration
      }
    }
    if (throwError) {
      throw new Error('Does not has registered name or alias in container')
    }
  }

  injectIn(params: Record<string | symbol, any>): typeof params {
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
            return Container.getFromRegistration(this.getRegistration(regName))
              ?? Container.getFromRegistration(this.getRegistration(value)) ?? value
          }
          case "symbol": {
            return Container.getFromRegistration(this.getRegistration(value)) ?? value
          }
          default: {
            return value
          }
        }
      }
    })
  }
}

export default Container
