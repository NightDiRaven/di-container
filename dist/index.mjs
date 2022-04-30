class DIContainer {
  constructor() {
    this.registrations = /* @__PURE__ */ new Map();
    this.aliases = /* @__PURE__ */ new Map();
  }
  getProxy() {
    return new Proxy(this, {
      get(target, key) {
        return target.get(key);
      }
    });
  }
  registerSingleton(name, classConstructor, ...args) {
    const registration = {
      type: "SINGLETON" /* SINGLETON */,
      ClassDeclaration: classConstructor,
      args
    };
    this.registrations.set(name, registration);
  }
  registerClass(name, classConstructor) {
    const registration = {
      type: "FACTORY" /* FACTORY */,
      ClassDeclaration: classConstructor
    };
    this.registrations.set(name, registration);
  }
  registerFunction(name, functionFactory) {
    const registration = {
      type: "FUNCTION" /* FUNCTION */,
      executor: functionFactory
    };
    this.registrations.set(name, registration);
  }
  registerValue(name, value) {
    const registration = {
      type: "VALUE" /* VALUE */,
      value
    };
    this.registrations.set(name, registration);
  }
  alias(name, alias) {
    if (!this.registrations.has(name))
      throw new Error(`Doesnt have registered container with name ${String(name)}`);
    this.aliases.set(alias, name);
  }
  get(name, args) {
    const registration = this.registrations.get(this.getName(name));
    switch (registration.type) {
      case "FACTORY" /* FACTORY */: {
        const factory = registration;
        return new factory.ClassDeclaration(...args ?? []);
      }
      case "FUNCTION" /* FUNCTION */: {
        const func = registration;
        return func.executor(...args ?? []);
      }
      case "SINGLETON" /* SINGLETON */: {
        const singleton = registration;
        if (!singleton.instance)
          singleton.instance = new singleton.ClassDeclaration(...singleton.args);
        return singleton.instance;
      }
      case "VALUE" /* VALUE */: {
        return registration.value;
      }
      default:
        throw new Error(`Unknown type${registration.type}`);
    }
  }
  getName(nameOrAlias) {
    if (this.registrations.has(nameOrAlias))
      return nameOrAlias;
    const name = this.aliases.get(nameOrAlias);
    if (!name)
      throw new Error("Does not has registered name or alias in container");
    return name;
  }
}
const DIContainer$1 = DIContainer;

export { DIContainer$1 as DIContainer };
