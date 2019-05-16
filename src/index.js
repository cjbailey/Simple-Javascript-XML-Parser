import "./styles.css";
import XmlDocument from "./XmlDocument";

const parseBtn = document.getElementById( "xml-parse-btn" );
parseBtn.addEventListener( "click", () => {
    let xmlContent = document.getElementById( "xml-import" ).value;
    let xmlDoc = new XmlDocument( xmlContent );
    let parsedResultElement = document.getElementById( "xml-parsed-result" );
    let result = xmlDoc.toString( {
        prettyPrint: true,
        indent: 2,
        newLine: "\n"
    } );
    parsedResultElement.value = result;

    console.log( result );
} );