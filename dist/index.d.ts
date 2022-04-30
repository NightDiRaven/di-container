interface DIContainerKey<T> extends Symbol {
}
declare type ContainerName<T> = string | DIContainerKey<T>;
interface RegistrationConfiguration<T> {
    singleton?: boolean;
    params?: Record<string, any>;
    aliases?: ContainerName<T>[];
}
interface DIContainerInterface {
    register<T>(name: ContainerName<T>, classConstructor: T, config?: RegistrationConfiguration<T>): void;
    registerSingleton(name: ContainerName<any>, classConstructor: any, params: any[]): void;
    registerClass(name: ContainerName<any>, classConstructor: any): void;
    registerFunction(name: ContainerName<any>, classConstructorOrCallback: () => any): void;
    aliases(name: ContainerName<any>, aliases: Iterable<ContainerName<any>>): void;
    get<T>(name: string | DIContainerKey<T>, args?: any[]): T;
}

declare class DIContainer implements DIContainerInterface {
    private readonly registrations;
    constructor();
    register<T>(name: string | DIContainerKey<T>, value: any, config?: RegistrationConfiguration<T>): void;
    /**
     * @deprecated use register instead
     * @param name
     * @param classConstructor
     * @param params
     */
    registerSingleton(name: ContainerName<any>, classConstructor: any, params: any[]): void;
    /**
     * @deprecated use register instead
     * @param name
     * @param classConstructor
     */
    registerClass(name: ContainerName<any>, classConstructor: any): void;
    /**
     * @deprecated use register instead
     * @param name
     * @param functionFactory
     */
    registerFunction(name: ContainerName<any>, functionFactory: (...args: any[]) => any): void;
    /**
     *
     * @deprecated use register instead
     * @param name
     * @param value
     */
    registerValue(name: ContainerName<any>, value: any): void;
    aliases(name: ContainerName<any>, aliases: Iterable<ContainerName<any>>): void;
    unregister(name: ContainerName<any>): void;
    get<T>(name: string | DIContainerKey<T>, params?: Record<string, any>): T;
    private addRegistration;
    private getRegistration;
}

export { DIContainer, DIContainerKey };
