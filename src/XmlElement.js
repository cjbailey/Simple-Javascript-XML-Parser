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
			indent: 2
		} );
		let newLine = args && args.prettyPrint ? "\n" : "";
		let indent = args.prettyPrint ? " ".repeat( args.indent * level ) : "";
		return `${newLine}${indent}<${this._tagName}${renderAttributes(this._attributes)}>${renderChildren(this._children, args, level + 1)}${indent}</${this._tagName}>${newLine}`;
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
	return result;
}