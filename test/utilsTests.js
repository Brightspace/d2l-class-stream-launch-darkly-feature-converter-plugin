const assert = require( 'chai' ).assert;
const utils = require( '../src/utils.js' );

describe( 'utils', function() {
	describe( 'duplicatesDeep', function() {

		const duplicatesDeep = utils.duplicatesDeep;

		it( 'should find duplicates within single array', function() {

			const duplicates = duplicatesDeep(
				[ 1, 2, 3, 1, 4, 1, 3 ]
			);
			assert.deepEqual( duplicates, [ 1, 3 ] );
		} );

		it( 'should find duplicates across arrays', function() {

			const duplicates = duplicatesDeep( [
				[ 1, 2, 3 ],
				[ 1, 4, 1 ],
				[ 3 ]
			] );
			assert.deepEqual( duplicates, [ 1, 3 ] );
		} );
	} );
} );