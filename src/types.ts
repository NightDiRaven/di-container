// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DIContainerKey<T> extends Symbol {

}

type ContainerKey<T> = symbol & DIContainerKey<T>

export type ContainerRegistrations<T extends ContainerKey<any> = ContainerKey<any>, U = any> = Record<T, U>

export type ContainerName<T> = string | DIContainerKey<T>
export type Inject<T> = ContainerName<T> & Partial<T>
export type ContainerProxy<T extends Record<any, any>> = ProxyHandler<T> & ContainerRegistrations

export interface RegistrationConfiguration<T> {
  singleton?: boolean,
  inject?: boolean,
  params?: Record<string, any>,
  aliases?: ContainerName<T>[]
}

export interface Registration<T> {
  executor: (params?: Record<string, any>) => T,
  persist: boolean
  instance?: T
  params?: Record<string, any>
  aliases: Set<ContainerName<T>>
  unregister: () => void
}

export interface DIContainerInterface {
  register<T>(name: ContainerName<T>, classConstructor: T, config?: RegistrationConfiguration<T>): void

  aliases(name: ContainerName<any>, aliases: Iterable<ContainerName<any>>): void

  get<T>(name: string | DIContainerKey<T>, args?: any[]): T

  inject<T>(value: any, params?: Record<string, any>): T
}

export interface DIContainerConfiguration {
  injectPrefix?: string|false
}
