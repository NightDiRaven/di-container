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
    aliases(name: ContainerName<any>, aliases: Iterable<ContainerName<any>>): void;
    get<T>(name: string | DIContainerKey<T>, args?: any[]): T;
}

declare class DIContainer implements DIContainerInterface {
    private readonly registrations;
    constructor();
    register<T>(name: string | DIContainerKey<T>, value: any, config?: RegistrationConfiguration<T>): void;
    aliases(name: ContainerName<any>, aliases: Iterable<ContainerName<any>>): void;
    unregister(name: ContainerName<any>): void;
    get<T>(name: string | DIContainerKey<T>, params?: Record<string, any>): T;
    private addRegistration;
    private getRegistration;
}

export { DIContainer, DIContainerKey };
