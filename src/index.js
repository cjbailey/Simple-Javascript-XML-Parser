import "./styles.css";
import XmlDocument from "./XmlDocument";
import XmlElement from "./XmlElement";

let xml = "<root><list><item id='1'></item></list></root>";
let xmlDoc = new XmlDocument(xml);

console.log(xmlDoc);
