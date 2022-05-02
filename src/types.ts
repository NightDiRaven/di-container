// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContainerKey<T> extends Symbol {
}

export type ContainerName<T = string | number | symbol> = string | ContainerKey<T>

// @ts-ignore for ContainerKey === symbol
export type RegistrationsMap<T extends ContainerKey<any> = ContainerKey<any>, U = any> = Map<ContainerName, Registration>

export type Inject<T> = ContainerName<T> & Partial<T>

export interface RegistrationConfiguration {
  singleton?: boolean,
  inject?: boolean,
  params?: Record<string, any>,
  aliases?: ContainerName[]
}

export interface Registration{
  executor: (params?: Record<string | number | symbol, any>) => any,
  singleton: boolean
  inject: boolean;
  params?: Record<string, any>
  aliases: Set<ContainerName>
  instance?: any
  unregister: () => void
}

export interface ContainerConfiguration {
  injectPrefix?: string | false
}
