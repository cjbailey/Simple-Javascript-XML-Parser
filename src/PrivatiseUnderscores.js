function PrivatiseUnderscores(obj) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      if (prop.startsWith("_")) return;

      if (typeof target[prop] === "function") return target[prop].bind(target);

      return target[prop];
    },

    set(target, prop, value, receiver) {
      if (prop.startsWith("_")) return false;

      target[prop] = value;
    }
  });
}

export default PrivatiseUnderscores;
