class Container {
  constructor({ injectPrefix = false } = {}) {
    this.registrations = /* @__PURE__ */ new Map();
    this.injectPrefix = injectPrefix;
  }
  inject(value, params) {
    params = Object.assign({}, params);
    return value(this.injectIn(params));
  }
  register(name, value, config = {}) {
    const container = this;
    const registration = {
      executor(params) {
        params = Object.assign({}, this.params, params);
        return value(this.inject ? container.injectIn(params) : params);
      },
      singleton: config.singleton || false,
      inject: config.inject || true,
      params: config.params,
      aliases: new Set(config?.aliases),
      unregister: () => this.registrations.delete(name)
    };
    this.registrations.set(name, registration);
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
    return Container.getFromRegistration(this.getRegistration(name, true), params);
  }
  static getFromRegistration(registration, params) {
    if (!registration) {
      return void 0;
    }
    if (registration.singleton) {
      if (!registration.instance) {
        registration.instance = registration.executor(params);
      }
      return registration.instance;
    }
    return registration.executor(params);
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
            return Container.getFromRegistration(this.getRegistration(regName)) ?? Container.getFromRegistration(this.getRegistration(value)) ?? value;
          }
          case "symbol": {
            return Container.getFromRegistration(this.getRegistration(value)) ?? value;
          }
          default: {
            return value;
          }
        }
      }
    });
  }
}
const Container$1 = Container;

export { Container$1 as Container };
