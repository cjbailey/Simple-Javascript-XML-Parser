import XmlDocument from "../src/XmlDocument";
import XmlElement from "../src/XmlElement";

it( "XmlDocument renders correctly", () => {
    let xml = "<?xml version='1.0' encoding='UTF-8'?><root><list><item id='1'>Hello world</item><item id='2'>Goodbye</item></list></root>";
    let xmlDoc = new XmlDocument( xml );

    expect( xmlDoc.toString() ).toBe( xml );
} );

it( "XmlDocument cannot contain multiple root nodes", () => {
    let xml = "<root lang='en'><foo ref='qwe' ref2='123'><foobar></foobar></foo></root>";
    let xmlDoc = new XmlDocument( xml );

    expect( xmlDoc.toString() ).toBe( xml );

    xmlDoc.append( new XmlElement( "invalid" ) );
    expect( xmlDoc.toString() ).toBe( xml );
} );

it( "<!DOCTYPE html> is invalid XML", () => {
    let xml = "<!DOCTYPE html><root><foo>1234</foo></root>";
    expect( () => new XmlDocument( xml ) ).toThrow( "Error while parsing XML string" );
} );

it( "<?xml ... ?> attributes are included in XmlDocument attributes", () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?><root></root>';
    let xmlDoc = new XmlDocument( xml );

    expect( xmlDoc.attributes.filter( x => x.name === "version" && x.value === "1.0" ).length === 1 ).toBe( true );
    expect( xmlDoc.attributes.filter( x => x.name === "encoding" && x.value === "UTF-8" ).length === 1 ).toBe( true );
} );

it( "Self-terminating tags are parsed correctly", () => {
    let xmlInput = "<root><foo abc='1234'><bar/></foo></root>";
    let xmlDoc = new XmlDocument( xmlInput );
    let xmlOutput = "<root><foo abc='1234'><bar></bar></foo></root>";

    expect( xmlDoc.toString() ).toBe( xmlOutput );
} );

it( "Recursive filtering returns correct elements", () => {
    let xmlInput = "<root><foo abc='1234'><bar>hello</bar><bar>world</bar></foo></root>";
    let xmlDoc = new XmlDocument( xmlInput );
    let result = xmlDoc.recursiveFilter( x => x.tagName && x.tagName === "bar" );
    expect( result.length ).toBe( 2 );
    expect( result[0].tagName ).toBe( "bar" );
    expect( result[1].tagName ).toBe( "bar" );
} );

it( "XML document is pretty printed if requested", () => {
    let xml = "<?xml version='1.0' encoding='UTF-8'?><root><list><item id='1'>Hello world</item><item id='2'>Goodbye</item></list></root>";
    let xmlDoc = new XmlDocument( xml );
    let expectedXml = "<?xml version='1.0' encoding='UTF-8'?>\n<root>\n  <list>\n    <item id='1'>Hello world</item>\n    <item id='2'>Goodbye</item>\n  </list>\n</root>";

    let resultXml = xmlDoc.toString( {
        prettyPrint: true,
        newLine: "\n"
    } );

    console.log( resultXml );
    expect( resultXml ).toBe( expectedXml );
} );

it( "XML with namespaces and more unusual characters is parsed correctly", () => {
    let xmlInput = "<root><ns0:node1>Some value</ns0:node1><ns0:node2>http://www.dummywebsite.com/blah/blah</ns0:node2></root>";
    let xmlDoc = new XmlDocument( xmlInput );

    expect( xmlDoc.toString() ).toBe( xmlInput );
} );

it( "Attributes including colons (i.e. namespaces) are parsed correctly", () => {
    let xmlInput = "<root><item ns0:ref1='some:value' ns1:ref2='another-value'></item></root>";
    let xmlDoc = new XmlDocument( xmlInput );

    expect( xmlDoc.toString() ).toBe( xmlInput );
} );

it( "Self-terminating tags are parsed correctly", () => {
    let xmlInput = "<root><item /><foo/></root>";
    let xmlDoc = new XmlDocument( xmlInput );
    let expectedXml = "<root><item></item><foo></foo></root>";

    expect( xmlDoc.toString() ).toBe( expectedXml );
} );