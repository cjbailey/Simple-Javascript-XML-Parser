function XmlAttribute(name, value) {
  this._name = name;
  this._value = value;
}

XmlAttribute.prototype = {
  get name() {
    return this._name;
  },

  get value() {
    return this._value;
  },

  toString() {
    return `${this._name}='${this._value}'`;
  }
};

export default XmlAttribute;
