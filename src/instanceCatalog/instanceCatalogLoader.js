const InstanceCatalog = require( './InstanceCatalog.js' );
const parseInstanceCatalog = require( './instanceCatalogParser.js' );
const fsUtil = require( 'fs' );
const URL = require( 'url' ).URL;

function loadInstanceCatalogFile( url, callback ) {

	fsUtil.readFile( url, ( err, content ) => {

		if( err ) {
			return callback( err );
		}

		try {
			const json = JSON.parse( content );
			const catalog = parseInstanceCatalog( json );
			return callback( null, catalog );

		} catch( err ) {
			return callback( err );
		}
	} );
}

module.exports = function loadInstanceCatalog( callback ) {

	const src = process.env.D2L_CLASS_STREAM_INSTANCE_CATALOG_SOURCE;
	if( !src ) {

		const catalog = new InstanceCatalog( new Map() );
		return callback( null, catalog );
	}

	let url;
	try {
		url = new URL( src );
	} catch( err ) {
		return callback( err );
	}

	switch( url.protocol ) {

		case 'file:':
			return loadInstanceCatalogFile( url, callback );
	}

	const error = new Error( `Only file instance catalog sources are currently supported: ${src}` );
	return callback( error );
};
