import XmlElement from "./XmlElement";
import XmlAttribute from "./XmlAttribute";
import XmlTextContent from "./XmlTextContent";
import defaults from "./defaults";

const beginTag = "<";
const endTag = "</";
const xmlHead = "?xml";
const splitByNodeRegex = /<[^>]+>[^</]*/g;
const parseTagNameRegex = /(<|<\/)([\w:?-]+)/;
const parseTagValueRegex = tagName => new RegExp( `(?=<${tagName}.+(?=\s|>)).+?(?=>)>(.*)` );
const parseAttributesRegex = /\w+=("|').*?[^\\]\1/g;
const parseAttributeNameRegex = /^\w+(?=\=)/g;
const parseAttributeValueRegex = /("|').+\1/g;

function XmlDocument( xmlString ) {
    XmlElement.call( this );
    this._xmlString = xmlString;
    try {
        let result = parseXml( xmlString );
        this.append( result.root );
        this._attributes.push( ...result.attributes );
    } catch ( exception ) {
        throw exception;
    }
}

XmlDocument.prototype = Object.assign( Object.create( XmlElement.prototype ), {
    toString( args ) {
        args = defaults( args, {
            prettyPrint: false,
            indent: 2,
            newLine: "\n"
        } );
        let newLine = args.prettyPrint ? args.newLine : "";
        return this._children.length > 0 ? ( this._attributes.length > 0
            ? `<?xml ${this._attributes.join( " " )}?>${newLine}` : "" ) + formattedResult( this._children[0].toString( args ), args )
            : "";
    },

    append( childElement ) {
        if ( this._children > 0 ) return;

        XmlElement.prototype.append.call( this, childElement );
    }
} );

export default XmlDocument;


function formattedResult( input, args ) {
    return args.prettyPrint ? input.trim().replace( new RegExp( `${args.newLine}{2,}`, "g" ), args.newLine ) : input.trim();
}

function parseXml( xmlString ) {
    // break down the XML string into it's constituent tags
    let nodes = xmlString.match( splitByNodeRegex );
    let openTag = [];
    let closedTag;
    let docAttributes = [];

    nodes.forEach( ( node, idx ) => {
        let tag = node.match( parseTagNameRegex );
        if ( !tag || tag.length !== 3 ) throw new Error( "Error while parsing XML string" );

        let tagType = tag[1];
        if ( tagType === beginTag ) {
            processBeginTag( node, tag[2], docAttributes, openTag );
        } else if ( tagType === endTag ) {
            closedTag = processEndTag( tag[2], openTag, closedTag );
        }
    } );

    return {
        root: closedTag,
        attributes: docAttributes
    };
}

function processBeginTag( node, tagName, docAttributes, openTag ) {
    let attribStr = node.match( parseAttributesRegex );
    let attribs = [];
    if ( attribStr ) {
        attribStr.forEach( attrAndValue => {
            let attr = attrAndValue.match( parseAttributeNameRegex );
            if ( attr ) {
                let val = attrAndValue.match( parseAttributeValueRegex );
                attribs.push( new XmlAttribute( attr[0], val ? val[0].replace( /("|')/g, "" ) : "" ) );
            }
        } );
    }

    if ( tagName.startsWith( xmlHead ) ) {
        docAttributes.push( ...attribs );
    } else {
        let el = new XmlElement( tagName, ...attribs );

        // Check for inner text content
        let tagValue = node.match( parseTagValueRegex( tagName ) );
        if ( tagValue && tagValue.length > 0 ) {
            el.append( new XmlTextContent( tagValue[1] ) );
        }

        openTag.push( el );
    }
}

function processEndTag( tagName, openTag, closedTag ) {
    do {
        closedTag = openTag.pop();
        if ( !closedTag ) {
            throw new Error( "closedTag is undefined" );
        }

        if ( openTag.length > 0 ) {
            openTag[openTag.length - 1].append( closedTag );
        }
    } while ( closedTag.tagName !== tagName && openTag.length > 0 );

    return closedTag;
}