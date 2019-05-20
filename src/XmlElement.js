import XmlTextContent from "./XmlTextContent";
import defaults from "./defaults";

function XmlElement( tagName, ...attributes ) {
    this._tagName = tagName;
    this._attributes = attributes;
    this._children = [];
}

XmlElement.prototype = {
    get tagName() {
        return this._tagName;
    },

    get attributes() {
        return this._attributes;
    },

    get children() {
        return this._children;
    },

    get innerText() {
        return this._children && Array.isArray( this._children ) ? this._children.reduce( ( acc, cv ) => {
            if ( cv instanceof XmlTextContent ) {
                return acc.concat( cv.toString() );
            } else if ( cv instanceof XmlElement ) {
                return acc.concat( cv.innerText );
            }
        }, "" ).trim() : "";
    },

    append( childElement ) {
        if ( childElement instanceof XmlElement || childElement instanceof XmlTextContent ) {
            this._children.push( childElement );
        }
    },

    recursiveFilter( predicate ) {
        let filtered = [];

        if ( this._children.length > 0 ) {
            this._children.filter( child => {
                if ( child instanceof XmlElement ) {
                    if ( predicate( child ) === true ) filtered.push( child );
                    filtered = filtered.concat( child.recursiveFilter( predicate ) );
                }
            } );
        }

        return filtered;
    },

    toString( args, level = 0 ) {
        args = defaults( args, {
            prettyPrint: false,
            indent: 2,
            newLine: "\n"
        } );
        args.newLine = args.prettyPrint ? args.newLine : "";
        let indent = calcIndent( args, level );
        return `${args.newLine}${indent}<${this._tagName}${renderAttributes( this._attributes )}>${renderChildren( this._children, args, level + 1 )}</${this._tagName}>${args.newLine}`;
    }
};

export default XmlElement;

function renderAttributes( attributes ) {
    if ( !Array.isArray( attributes ) || attributes.length === 0 ) return "";
    return " " + attributes.join( " " );
}

function renderChildren( children, args, level ) {
    if ( !Array.isArray( children ) || children.length === 0 ) return "";
    let result = "";
    children.forEach( child => {
        result += child.toString( args, level );
    } );

    return `${result}${( args.prettyPrint && result.slice( -1 ) === args.newLine ) ? calcIndent( args, level - 1 ) : ""}`;
}

function calcIndent( args, level ) {
    return args.prettyPrint ? " ".repeat( args.indent * level ) : "";
}