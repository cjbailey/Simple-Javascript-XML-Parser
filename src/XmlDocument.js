import XmlElement from "./XmlElement";
import XmlAttribute from "./XmlAttribute";
import XmlTextContent from "./XmlTextContent";

const beginTag = "<";
const endTag = "</";

function XmlDocument(xmlString) {
  XmlElement.call(this);
  this._xmlString = xmlString;
  try {
    this.append(parseXml(xmlString));
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

const splitByNodeRegex = /(<)[^>]+>/g;
const parseTagNameRegex = /(<|<\/)([\w:]+)/;
const parseTagValueRegex = tagName => new RegExp(`(?=<${tagName}(?=\s|>)).+?(?=>)>(.*(?=<\/${tagName}>))`);
const parseAttributesRegex = /\w+=("|').*?[^\\]\1/g;
const parseAttributeNameRegex = /^\w+(?=\=)/g;
const parseAttributeValueRegex = /("|').+\1/g;

function parseXml(xmlString) {
  // break down the XML string into it's constituent tags
  let nodes = xmlString.match(splitByNodeRegex);
  let openTag = [];
  let closedTag;

  nodes.forEach((node, idx) => {
    let tagName = node.match(parseTagNameRegex);
    if (!tagName || tagName.length !== 3) throw new Error("Error while parsing XML string");

    if (tagName[1] === beginTag) {
      let attribStr = tagName.input.match(parseAttributesRegex);
      let attribs = [];
      if (attribStr) {
        attribStr.forEach(attrAndValue => {
          let attr = attrAndValue.match(parseAttributeNameRegex);
          let val = attrAndValue.match(parseAttributeValueRegex)[0].replace(/("|')/g, "");
          attribs.push(new XmlAttribute(attr, val));
        });
      }

      openTag.push(new XmlElement(tagName[2], ...attribs));
    } else if (tagName[1] === endTag) {
      closedTag = openTag.pop();

      // Check for inner text content
      let tagValue = xmlString.match(parseTagValueRegex(closedTag.tagName));
      if (tagValue) {
        console.log(tagValue);
        let isTextContent = tagValue[1].match(splitByNodeRegex) === null;
        if (isTextContent && tagValue[1].length > 0) {
          closedTag.append(new XmlTextContent(tagValue[1]));
        }
      }

      if (openTag.length > 0) {
        openTag[openTag.length - 1].append(closedTag);
      }
    }
  });

  return closedTag;
}
