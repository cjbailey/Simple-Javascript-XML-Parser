import XmlTextContent from "./XmlTextContent";

function XmlElement(tagName, ...attributes) {
  this._tagName = tagName;
  this._attributes = attributes;
  this._children = [];
}

XmlElement.prototype = {
  get tagName() {
    return this._tagName;
  },

  get attributes() {
    return this._attributes;
  },

  append(childElement) {
    if (childElement instanceof XmlElement || childElement instanceof XmlTextContent) {
      this._children.push(childElement);
    }
  },

  toString() {
    return `<${this._tagName}${renderAttributes(this._attributes)}>${renderChildren(this._children)}</${this._tagName}>`;
  }
};

export default XmlElement;

function renderAttributes(attributes) {
  if (!Array.isArray(attributes) || attributes.length === 0) return "";
  return " " + attributes.join(" ");
}

function renderChildren(children) {
  if (!Array.isArray(children) || children.length === 0) return "";
  return children.join();
}
