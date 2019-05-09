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

	get children() {
		return this._children;
	},

	append(childElement) {
		if (childElement instanceof XmlElement || childElement instanceof XmlTextContent) {
			this._children.push(childElement);
		}
	},

	recursiveFilter(predicate) {
		let filtered = [];

		if (this._children.length > 0) {
			this._children.filter(child => {
				if (child instanceof XmlElement) {
					if (predicate(child) === true) filtered.push(child);
					filtered = filtered.concat(child.recursiveFilter(predicate));
				}
			});
		}

		return filtered;
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
