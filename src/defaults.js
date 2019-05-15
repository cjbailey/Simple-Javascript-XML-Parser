function defaults( obj, defaultProps ) {
	let r = obj || {};
	if ( typeof defaultProps === "object" ) {
		for ( let p in defaultProps ) {
			r[ p ] = r[ p ] || defaultProps[ p ];
		}
	}
	return r;
}

export default defaults;