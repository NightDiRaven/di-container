interface DIContainerKey<T> extends Symbol {
}
interface Registration {
    type: RegistrationType;
}
interface DIContainerInterface {
    registerSingleton(name: string | DIContainerKey<any>, classConstructor: any): void;
    registerClass(name: string | DIContainerKey<any>, classConstructor: any): void;
    registerFunction(name: string | DIContainerKey<any>, classConstructorOrCallback: () => any): void;
    alias(name: string | DIContainerKey<any>, alias: string | DIContainerKey<any>): void;
    get<T>(name: string | DIContainerKey<T>, args?: any[]): T;
}

declare enum RegistrationType {
    FACTORY = "FACTORY",
    FUNCTION = "FUNCTION",
    SINGLETON = "SINGLETON",
    VALUE = "VALUE"
}
declare class DIContainer implements DIContainerInterface {
    registrations: Map<string | DIContainerKey<any>, Registration>;
    aliases: Map<string | DIContainerKey<any>, string | DIContainerKey<any>>;
    constructor();
    getProxy(): { [key in keyof this["registrations"] & keyof this["aliases"]]: this["registrations"]; };
    registerSingleton(name: string | DIContainerKey<any>, classConstructor: any, ...args: any[]): void;
    registerClass(name: string | DIContainerKey<any>, classConstructor: any): void;
    registerFunction(name: string | DIContainerKey<any>, functionFactory: (...args: any[]) => any): void;
    registerValue(name: string | DIContainerKey<any>, value: any): void;
    alias(name: string | DIContainerKey<any>, alias: string | DIContainerKey<any>): void;
    get<T>(name: string | DIContainerKey<T>, args?: any[]): T;
    private getName;
}

export { DIContainer, DIContainerKey };
