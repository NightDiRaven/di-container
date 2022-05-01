interface DIContainerKey<T> extends Symbol {
}
declare type ContainerName<T> = string | DIContainerKey<T>;
declare type Inject<T> = ContainerName<T> & Partial<T>;
interface RegistrationConfiguration<T> {
    singleton?: boolean;
    inject?: boolean;
    params?: Record<string, any>;
    aliases?: ContainerName<T>[];
}
interface DIContainerInterface {
    register<T>(name: ContainerName<T>, classConstructor: T, config?: RegistrationConfiguration<T>): void;
    aliases(name: ContainerName<any>, aliases: Iterable<ContainerName<any>>): void;
    get<T>(name: string | DIContainerKey<T>, args?: any[]): T;
    inject<T>(value: (params: Record<string, ContainerName<T>>) => any): void;
    inject<T>(value: any, params?: Record<string, any>): T;
}
interface DIContainerConfiguration {
    injectPrefix?: string | false;
}

declare class DIContainer implements DIContainerInterface {
    private readonly registrations;
    private readonly injectPrefix;
    constructor({ injectPrefix }?: DIContainerConfiguration);
    inject<T>(value: T, params?: Record<string, any>): T;
    register<T>(name: string | DIContainerKey<T>, value: any, config?: RegistrationConfiguration<T>): void;
    aliases(name: ContainerName<any>, aliases: Iterable<ContainerName<any>>): void;
    unregister(name: ContainerName<any>): void;
    get<T>(name: string | DIContainerKey<T>, params?: Record<string, any>): T;
    private static getFromRegistration;
    private addRegistration;
    private getRegistration;
    injectIn(params: Record<string | symbol, any>): ProxyHandler<typeof params>;
    private static exec;
}

export { DIContainer, DIContainerKey, Inject };
