const _ = require( 'lodash' );
const assert = require( 'chai' ).assert;
const convertersPlugin = require( '../src/index.js' );
const formatFileUrl = require( 'file-url' );
const fsUtil = require( 'fs' );
const pathUtil = require( 'path' );


describe( 'EndToEndTests', function() {

	const convertersMap = {};

	this.beforeAll( function( done ) {

		const path = pathUtil.join( __dirname, 'instanceCatalog.json' );
		const fileUrl = formatFileUrl( path );
		process.env.D2L_LMS_INSTANCE_CATALOG_SOURCE = fileUrl;

		const options = {};
		convertersPlugin( options, ( err, converters ) => {

			if( err ) {
				delete process.env.D2L_LMS_INSTANCE_CATALOG_SOURCE;
				return done( err );
			}

			_.forEach( converters, converter => {
				_.forEach( converter.schemas, schema => {
					convertersMap[schema] = converter;
				} );
			} );

			delete process.env.D2L_LMS_INSTANCE_CATALOG_SOURCE;
			return done();
		} );
	} );

	const testCasesPath = pathUtil.join( __dirname, '/testCases/endToEnd' );
	fsUtil.readdirSync( testCasesPath ).map( name => {

		describe( name, function() {
			it( 'should convert', function( done ) {

				const definitionPath = pathUtil.join( testCasesPath, name, 'definition.json' );
				const definition = require( definitionPath );

				const expectedPath = pathUtil.join( testCasesPath, name, 'expected.json' );
				const expected = require( expectedPath );

				const schema = definition.$schema;
				const converter = convertersMap[schema];
				assert( converter, `converter should be constructed for schema: ${ schema }` );
	
				converter.convert( definition, {}, ( err, feature ) => {

					if( err ) {
						return done( err );
					}
			
					assert.deepEqual( feature, expected );
					done();
				} );
			} );
		} );
	} );
} );