const sortableVersionBuilder = require( './sortableVersionBuilder.js' );

module.exports = function( versions ) {

	if( !versions ) {
		return null;
	}

	const result = {};

	if( versions.start ) {
		result.start = sortableVersionBuilder( versions.start );
	}

	if( versions.end ) {
		result.end = sortableVersionBuilder( versions.end );
	}
	
	if( result.start && result.end ) {
		if( result.start > result.end ) {
			throw new Error( `Version start is greater than version end: ${ versions.start } > ${ versions.end }` );
		}
	}

	return result;
};
