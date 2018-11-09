const assert = require( 'chai' ).assert;
const formatFileUrl = require( 'file-url' );
const loadInstanceCatalog = require( '../src/instanceCatalog/instanceCatalogLoader.js' );
const pathUtil = require( 'path' );

describe( 'loadInstanceCatalogAsync', function() {

	function cleanUp() {
		delete process.env.D2L_CLASS_STREAM_INSTANCE_CATALOG_SOURCE;
	}

	beforeEach( cleanUp );
	afterEach( cleanUp );

	it( 'should load instance catalog file', function( done ) {

		const path = pathUtil.join( __dirname, 'instanceCatalog.json' );
		const fileUrl = formatFileUrl( path );
		process.env.D2L_CLASS_STREAM_INSTANCE_CATALOG_SOURCE = fileUrl;

		loadInstanceCatalog( ( err, catalog ) => {

			if( err ) {
				return done( err );
			}

			const tenantId = catalog.mapTenantDomain( 'www.tenant_b.org' );
			assert.equal( tenantId, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' );

			return done();
		} );
	} );

	it( 'should return empty catalog when not configured', function( done ) {

		loadInstanceCatalog( ( err, catalog ) => {

			if( err ) {
				return done( err );
			}

			assert( catalog.isEmpty, 'should return empty catalog' );
			return done();
		} );
	} );

	it( 'should callback with error when not json file', function( done ) {

		const path = pathUtil.join( __dirname, '../.gitignore' );
		const fileUrl = formatFileUrl( path );
		process.env.D2L_CLASS_STREAM_INSTANCE_CATALOG_SOURCE = fileUrl;

		loadInstanceCatalog( ( err, catalog ) => {

			assert( err, 'Should callback with error' );
			assert.equal( err.message, 'Unexpected token . in JSON at position 0' );

			assert.isUndefined( catalog, 'Catalog should not be loaded' );

			return done();
		} );
	} );

	it( 'should callback with error when not file url', function( done ) {

		process.env.D2L_CLASS_STREAM_INSTANCE_CATALOG_SOURCE = 'ftp://test.org/catalog.json';

		loadInstanceCatalog( ( err, catalog ) => {

			assert( err, 'Should callback with error' );
			assert.equal( err.message, 'Only file instance catalog sources are currently supported: ftp://test.org/catalog.json' );

			assert.isUndefined( catalog, 'Catalog should not be loaded' );

			return done();
		} );
	} );

	it( 'should callback with error when not url', function( done ) {

		process.env.D2L_CLASS_STREAM_INSTANCE_CATALOG_SOURCE = ':::';

		loadInstanceCatalog( ( err, catalog ) => {

			assert( err, 'Should callback with error' );
			assert.equal( err.message, 'Invalid URL: :::' );

			assert.isUndefined( catalog, 'Catalog should not be loaded' );

			return done();
		} );
	} );

	it( 'should callback with error when file url does not exist', function( done ) {

		const path = pathUtil.join( __dirname, 'wacky.json' );
		const fileUrl = formatFileUrl( path );
		process.env.D2L_CLASS_STREAM_INSTANCE_CATALOG_SOURCE = fileUrl;

		loadInstanceCatalog( ( err, catalog ) => {

			assert( err, 'Should callback with error' );
			assert(
				err.message.startsWith( 'ENOENT: no such file or directory' ),
				`Should be no such file error: ${err.message}`
			);

			assert.isUndefined( catalog, 'Catalog should not be loaded' );

			return done();
		} );
	} );
} );