import XmlElement from "./XmlElement";
import XmlAttribute from "./XmlAttribute";
import XmlTextContent from "./XmlTextContent";

const beginTag = "<";
const endTag = "</";
const xmlHead = "?xml";
const splitByNodeRegex = /(<)[^>]+>/g;
const parseTagNameRegex = /(<|<\/)([\w:?]+)/;
const parseTagValueRegex = tagName => new RegExp(`(?=<${tagName}(?=\s|>)).+?(?=>)>(.*(?=<\/${tagName}>))`);
const parseAttributesRegex = /\w+=("|').*?[^\\]\1/g;
const parseAttributeNameRegex = /^\w+(?=\=)/g;
const parseAttributeValueRegex = /("|').+\1/g;

function XmlDocument(xmlString) {
	XmlElement.call(this);
	this._xmlString = xmlString;
	try {
		let result = parseXml(xmlString);
		this.append(result.root);
		this._attributes.push(...result.attributes);
	} catch (exception) {
		throw exception;
	}
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
	let nodes = xmlString.match(splitByNodeRegex);
	let openTag = [];
	let closedTag;
	let docAttributes = [];

	nodes.forEach(node => {
		let tagName = node.match(parseTagNameRegex);
		if (!tagName || tagName.length !== 3) throw new Error("Error while parsing XML string");

		if (tagName[1] === beginTag) {
			processBeginTag(tagName, docAttributes, openTag);
		} else if (tagName[1] === endTag) {
			closedTag = processEndTag(xmlString, tagName, openTag, closedTag);
		}
	});

	return {
		root: closedTag,
		attributes: docAttributes
	};
}

function processBeginTag(tagName, docAttributes, openTag) {
	let attribStr = tagName.input.match(parseAttributesRegex);
	let attribs = [];
	if (attribStr) {
		attribStr.forEach(attrAndValue => {
			let attr = attrAndValue.match(parseAttributeNameRegex);
			if (attr) {
				let val = attrAndValue.match(parseAttributeValueRegex);
				attribs.push(new XmlAttribute(attr[0], val ? val[0].replace(/("|')/g, "") : ""));
			}
		});
	}

	if (tagName[2].startsWith(xmlHead)) {
		docAttributes.push(...attribs);
	} else {
		openTag.push(new XmlElement(tagName[2], ...attribs));
	}
}

function processEndTag(xmlString, tagName, openTag, closedTag) {
	do {
		closedTag = openTag.pop();
		if (!closedTag) {
			console.debug("closedTag is undefined");
			console.debug(openTag);
		}

		// Check for inner text content
		let tagValue = xmlString.match(parseTagValueRegex(closedTag.tagName));
		if (tagValue) {
			let isTextContent = tagValue[1].match(splitByNodeRegex) === null;
			if (isTextContent && tagValue[1].length > 0) {
				closedTag.append(new XmlTextContent(tagValue[1]));
			}
		}

		if (openTag.length > 0) {
			openTag[openTag.length - 1].append(closedTag);
		}
	} while (closedTag.tagName !== tagName[2] && openTag.length > 0);

	return closedTag;
}
