import XmlAttribute from "../XmlAttribute";

it("XmlAttribute is created okay", () => {
  let xmlAttribute = new XmlAttribute("attrName", "12345");

  expect(xmlAttribute.name).toBe("attrName");
  expect(xmlAttribute.value).toBe("12345");
});

it("XmlAttribute is rendered as a string correctly", () => {
  let xmlAttribute = new XmlAttribute("attrName", "12345");

  expect(xmlAttribute.toString()).toBe("attrName='12345'");
});
