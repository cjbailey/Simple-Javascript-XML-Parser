import XmlElement from "./XmlElement";
import XmlAttribute from "./XmlAttribute";

const beginTag = "<";
const endTag = "</";

function XmlDocument(xmlString) {
	XmlElement.call(this);
	this._xmlString = xmlString;
	this.append(parseXml(xmlString));
}

XmlDocument.prototype = Object.assign(Object.create(XmlElement.prototype), {
	toString() {
		return this._children.length > 0 ? this._children[0].toString() : "";
	},

	append(childElement) {
		if (this._children > 0) return;

		XmlElement.prototype.append.call(this, childElement);
	}
});

export default XmlDocument;

function parseXml(xmlString) {
	// break down the XML string into it's constituent tags
	let splitByNodeRegex = /(<)[^>]+>/g;
	let nodes = xmlString.match(splitByNodeRegex);
	let parseTagNameRegex = /(<|<\/)([\w:]+)/;
	let openTag = [];
	let closedTag;

	nodes.forEach((node, idx) => {
		let tagName = node.match(parseTagNameRegex);
		if (tagName.length !== 3) throw new Error("Error while parsing XML string");

		if (tagName[1] === beginTag) {
			let attribStr = tagName.input.match(/\w+=("|').*?[^\\]\1/g);
			let attribs = [];
			if (attribStr) {
				attribStr.forEach(attrAndValue => {
					let attr = attrAndValue.match(/^\w+(?=\=)/g);
					let val = attrAndValue.match(/("|').+\1/g)[0].replace(/("|')/g, "");
					attribs.push(new XmlAttribute(attr, val));
				});
			}

			openTag.push(new XmlElement(tagName[2], ...attribs));
		} else if (tagName[1] === endTag) {
			closedTag = openTag.pop();
			if (openTag.length > 0) {
				openTag[openTag.length - 1].append(closedTag);
			}
		}
	});

	return closedTag;
}
