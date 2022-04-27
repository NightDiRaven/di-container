import type { RegistrationType } from './DIContainer'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DIContainerKey<T> extends Symbol {

}

export interface Registration {
  type: RegistrationType
}

export interface RegistrationFunction<T> extends Registration {
  type: RegistrationType.FUNCTION
  executor: (...args: any[]) => T
}

export declare interface RegistrationFactory<T> extends Registration {
  type: RegistrationType.FACTORY
  ClassDeclaration: new (...args: any[]) => T
}

export declare interface RegistrationSingleton<T> extends Registration {
  type: RegistrationType.SINGLETON
  ClassDeclaration: new (...args: any[]) => T
  instance?: T
  args: any[]
}

export declare interface RegistrationValue extends Registration {
  type: RegistrationType.VALUE
  value: any
}

export interface DIContainerInterface {
  registerSingleton(name: string | DIContainerKey<any>, classConstructor: any): void

  registerClass(name: string | DIContainerKey<any>, classConstructor: any): void

  registerFunction(name: string | DIContainerKey<any>, classConstructorOrCallback: () => any): void

  alias(name: string | DIContainerKey<any>, alias: string | DIContainerKey<any>): void

  get<T>(name: string | DIContainerKey<T>, args?: any[]): T
}