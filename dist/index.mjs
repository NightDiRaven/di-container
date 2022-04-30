import isClass from 'is-class';

class DIContainer {
  constructor() {
    this.registrations = /* @__PURE__ */ new Map();
  }
  register(name, value, config) {
    switch (true) {
      case isClass(value):
        return this.addRegistration(name, (params) => new value({ ...config?.params, ...params }), config);
      case typeof value === "function":
        return this.addRegistration(name, (params) => value({ ...config?.params, ...params }), config);
      default:
        return this.addRegistration(name, () => value, config);
    }
  }
  aliases(name, aliases) {
    const registration = this.getRegistration(name);
    for (let alias of aliases) {
      registration.aliases.add(alias);
    }
  }
  unregister(name) {
    this.getRegistration(name).unregister();
  }
  get(name, params) {
    const registration = this.getRegistration(name);
    if (registration.persist) {
      if (!registration.instance) {
        registration.instance = registration.executor(params);
      }
      return registration.instance;
    }
    return registration.executor(params);
  }
  addRegistration(name, executor, config) {
    const registration = {
      executor,
      persist: config?.singleton || false,
      aliases: new Set(config?.aliases),
      unregister: () => this.registrations.delete(name)
    };
    this.registrations.set(name, registration);
  }
  getRegistration(name) {
    for (let [registrationName, registration] of this.registrations) {
      if (registrationName === name || registration.aliases.has(name)) {
        return registration;
      }
    }
    throw new Error("Does not has registered name or alias in container");
  }
}
const DIContainer$1 = DIContainer;

export { DIContainer$1 as DIContainer };
