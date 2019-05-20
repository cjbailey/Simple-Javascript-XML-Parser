import XmlElement from "../src/XmlElement";
import XmlAttribute from "../src/XmlAttribute";
import XmlTextContent from "../src/XmlTextContent";

it( "Simple XmlElement is created okay", () => {
    let xmlElement = new XmlElement( "foo" );
    expect( xmlElement.tagName ).toBe( "foo" );
} );

it( "XmlElement with one attribute is created okay", () => {
    let xmlAttribute = new XmlAttribute( "bar", "12345" );
    let xmlElement = new XmlElement( "foo", xmlAttribute );

    expect( xmlElement.tagName ).toBe( "foo" );
    expect( xmlElement.attributes.length ).toBe( 1 );
    expect( xmlElement.attributes[0] ).toBe( xmlAttribute );
    expect( xmlElement.attributes[0].name ).toBe( "bar" );
    expect( xmlElement.attributes[0].value ).toBe( "12345" );
} );

it( "XmlElement with many attributes is created okay", () => {
    let xmlAttributes = [new XmlAttribute( "bar", "12345" ), new XmlAttribute( "second", "hello" ), new XmlAttribute( "third", "world" )];
    let xmlElement = new XmlElement( "foo", ...xmlAttributes );

    expect( xmlElement.tagName ).toBe( "foo" );

    console.log( xmlElement.attributes );
    expect( xmlElement.attributes.length ).toBe( 3 );

    xmlElement.attributes.forEach( ( item, idx ) => {
        expect( item ).toBe( xmlAttributes[idx] );
        expect( item.name ).toBe( xmlAttributes[idx].name );
        expect( item.value ).toBe( xmlAttributes[idx].value );
    } );
} );

it( "XmlElement with no children is rendered as a string correctly", () => {
    let xmlAttributes = [new XmlAttribute( "bar", "12345" ), new XmlAttribute( "second", "hello" ), new XmlAttribute( "third", "world" )];
    let xmlElement = new XmlElement( "foo", ...xmlAttributes );

    expect( xmlElement.toString() ).toBe( "<foo bar='12345' second='hello' third='world'></foo>" );
} );

it( "XmlElement with children is rendered as a string correctly", () => {
    let xmlAttributes = [new XmlAttribute( "bar", "12345" ), new XmlAttribute( "second", "hello" ), new XmlAttribute( "third", "world" )];
    let xmlElement = new XmlElement( "foo", ...xmlAttributes );

    let xmlElement2 = new XmlElement( "fooParent" );
    xmlElement2.append( xmlElement );

    expect( xmlElement2.toString() ).toBe( "<fooParent><foo bar='12345' second='hello' third='world'></foo></fooParent>" );
} );

it( "XmlElement innerText returns inner text content omitting element tags", () => {
    let xmlElement = new XmlElement( "foo" );
    let bar1 = new XmlElement( "bar1" );
    let bar2 = new XmlElement( "bar2" );

    bar1.append( new XmlTextContent( "hello world" ) );
    bar2.append( new XmlTextContent( "goodbye Bob" ) );
    xmlElement.append( bar1 );
    xmlElement.append( bar2 );

    expect( xmlElement.innerText ).toBe( "hello worldgoodbye Bob" );
} );