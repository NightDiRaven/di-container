// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DIContainerKey<T> extends Symbol {

}

export type ContainerName<T> = string | DIContainerKey<T>

export interface RegistrationConfiguration<T> {
  singleton?: boolean,
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

  registerSingleton(name: ContainerName<any>, classConstructor: any, params: any[]): void

  registerClass(name: ContainerName<any>, classConstructor: any): void

  registerFunction(name: ContainerName<any>, classConstructorOrCallback: () => any): void

  aliases(name: ContainerName<any>, aliases: Iterable<ContainerName<any>>): void

  get<T>(name: string | DIContainerKey<T>, args?: any[]): T
}
