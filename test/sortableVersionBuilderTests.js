const assert = require( 'chai' ).assert;
const sortableVersionBuilder = require( '../src/sortableVersionBuilder.js' );

describe( 'sortableVersionBuilder', function() {

	it( 'should convert minimum', function() {

		const value = sortableVersionBuilder( '10.0.0.0' );
		assert.equal( value, 10000000000 );
	} );

	it( 'should convert single digits', function() {

		const value = sortableVersionBuilder( '10.1.2.3' );
		assert.equal( value, 10010200003 );
	} );

	it( 'should convert full digits', function() {

		const value = sortableVersionBuilder( '99.88.77.66666' );
		assert.equal( value, 99887766666 );
	} );
} );