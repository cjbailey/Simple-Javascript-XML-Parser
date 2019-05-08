function XmlTextContent(innerText) {
  this._innerText = innerText;
}

XmlTextContent.prototype = {
  toString() {
    return this._innerText;
  }
};

export default XmlTextContent;
