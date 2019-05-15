import "./styles.css";
import XmlDocument from "./XmlDocument";
import XmlElement from "./XmlElement";

let xml = "<?xml version='1.0' encoding='UTF-8'?><root><list><item id='1'>Hello world</item><item id='2'>Goodbye</item></list></root>";
let xmlDoc = new XmlDocument( xml );

console.log( xmlDoc.toString( {
    prettyPrint: true
} ) );