import XmlDocument from "../XmlDocument";
import XmlElement from "../XmlElement";

it("XmlDocument renders correctly", () => {
  let xml = "<root lang='en'><foo a='qwe'><foobar>hello world</foobar></foo></root>";
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
  expect(() => new XmlDocument(xml)).toThrow("Error while parsing XML string");
});

it("<?xml ... ?> attributes are included in XmlDocument attributes", () => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?><root></root>';
  let xmlDoc = new XmlDocument(xml);

  expect(xmlDoc.attributes.filter(x => x.name === "version" && x.value === "1.0").length === 1).toBe(true);
  expect(xmlDoc.attributes.filter(x => x.name === "encoding" && x.value === "UTF-8").length === 1).toBe(true);
});
