interface ContainerKey<T, P> extends Symbol {
}
declare type ContainerName<T = string | number | symbol, P = any> = string | ContainerKey<T, P>;
declare type Inject<T> = ContainerName<T> & Partial<T>;
interface RegistrationConfiguration {
    singleton?: boolean;
    inject?: boolean;
    params?: Record<string, any>;
    aliases?: ContainerName[];
}
interface ContainerConfiguration {
    injectPrefix?: string | false;
}

declare class Container {
    private readonly registrations;
    private readonly injectPrefix;
    constructor({ injectPrefix }?: ContainerConfiguration);
    inject<T>(value: (params: Record<any, any>) => T, params?: Record<string, any>): T;
    register(name: ContainerName, value: (params: any) => any, config?: RegistrationConfiguration): void;
    aliases(name: ContainerName<any>, aliases: Iterable<ContainerName<any>>): void;
    unregister(name: ContainerName<any>): void;
    get<T, P>(name: ContainerName<T, P>, params?: P): T;
    private static getFromRegistration;
    private getRegistration;
    injectIn(params: Record<string | symbol, any>): typeof params;
}

export { Container, ContainerName, Inject };
