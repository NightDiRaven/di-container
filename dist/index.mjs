import isClass from 'is-class';

class DIContainer {
  constructor({ injectPrefix = false } = {}) {
    this.registrations = /* @__PURE__ */ new Map();
    this.injectPrefix = injectPrefix;
  }
  inject(value, params) {
    return DIContainer.exec(value, this.injectIn({ ...params }));
  }
  register(name, value, config = {}) {
    if (config.inject ?? true) {
      this.addRegistration(name, (params) => DIContainer.exec(value, this.injectIn({ ...config.params, ...params })), config);
    } else {
      this.addRegistration(name, (params) => DIContainer.exec(value, { ...config.params, ...params }), config);
    }
  }
  aliases(name, aliases) {
    const registration = this.getRegistration(name, true);
    for (let alias of aliases) {
      registration.aliases.add(alias);
    }
  }
  unregister(name) {
    this.getRegistration(name, true).unregister();
  }
  get(name, params) {
    return DIContainer.getFromRegistration(this.getRegistration(name, true), params);
  }
  static getFromRegistration(registration, params) {
    if (!registration) {
      return void 0;
    }
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
  getRegistration(name, throwError) {
    for (let [registrationName, registration] of this.registrations) {
      if (registrationName === name || registration.aliases.has(name)) {
        return registration;
      }
    }
    if (throwError) {
      throw new Error("Does not has registered name or alias in container");
    }
  }
  injectIn(params) {
    return new Proxy(params, {
      get: (target, name) => {
        const value = target[name];
        switch (typeof name) {
          case "string": {
            let regName = name;
            if (this.injectPrefix) {
              if (!name.startsWith(this.injectPrefix)) {
                return value;
              }
              regName = name.substring(this.injectPrefix.length);
            }
            return DIContainer.getFromRegistration(this.getRegistration(regName)) ?? DIContainer.getFromRegistration(this.getRegistration(value)) ?? value;
          }
          case "symbol": {
            return DIContainer.getFromRegistration(this.getRegistration(value)) ?? value;
          }
          default: {
            return value;
          }
        }
      }
    });
  }
  static exec(value, params) {
    switch (true) {
      case isClass(value):
        return new value(params);
      case typeof value === "function":
        return value(params);
      default:
        return value;
    }
  }
}
const DIContainer$1 = DIContainer;

export { DIContainer$1 as DIContainer };
