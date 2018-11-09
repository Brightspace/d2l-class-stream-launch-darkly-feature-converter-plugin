const _ = require( 'lodash' );
const assert = require( 'chai' ).assert;
const VariationIndexMap = require( '../src/variations/VariationIndexMap.js' );

const map = {
	abc: 2,
	def: 1,
	ghi: 0
};

const variationIndexMap = new VariationIndexMap( map );

describe( 'VariationIndexMap', function() {

	describe( 'getIndex', function() {

		_.forIn( map, ( expectedIndex, variation ) => {

			it( `should map known variation: ${variation}`, function() {

				const index = variationIndexMap.getIndex( variation );
				assert.equal( index, expectedIndex );
			} );
		} );
		
		it( 'should throw when unknown variation', function() {

			assert.throws(
				() => variationIndexMap.getIndex( 'wacky' ),
				/Unknown variation key: wacky/
			);
		} );
	} );
} );