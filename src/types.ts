// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DIContainerKey<T> extends Symbol {

}


export type ContainerName<T> = string | DIContainerKey<T>
export type Inject<T> = ContainerName<T> & Partial<T>

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

  inject<T>(value: (params: Record<string, ContainerName<T>>) => any): void
  inject<T>(value: any, params?: Record<string, any>): T
}

export interface DIContainerConfiguration {
  injectPrefix?: string|false
}
