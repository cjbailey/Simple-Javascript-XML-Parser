import XmlDocument from "../XmlDocument";
import XmlElement from "../XmlElement";

it("XmlDocument renders correctly", () => {
  let xml = "<root lang='en'><foo a='qwe'><foobar></foobar></foo></root>";
  let xmlDoc = new XmlDocument(xml);

  expect(xmlDoc.toString()).toBe(xml);
});

it("XmlDocument cannot contain multiple root nodes", () => {
  let xml = "<root lang='en'><foo ref='qwe' ref2='123'><foobar></foobar></foo></root>";
  let xmlDoc = new XmlDocument(xml);

  expect(xmlDoc.toString()).toBe(xml);

  xmlDoc.append(new XmlElement("invalid"));
  expect(xmlDoc.toString()).toBe(xml);
});

it("<!DOCTYPE html> is invalid XML", () => {
  let xml = "<!DOCTYPE html><root><foo>1234</foo></root>";
  let xmlDoc = new XmlDocument(xml);

  console.log(xmlDoc.toString());
  expect(xmlDoc.toString()).toBe("");
});

it("<?xml ... ?> attributes are included in XmlDocument attributes", () => {});
