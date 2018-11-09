const _ = require( 'lodash' );
const assert = require( 'chai' ).assert;
const BooleanVariationMapper = require( '../src/variations/BooleanVariationMapper.js' );

const mapper = new BooleanVariationMapper();

function assertIndexes( indexes ) {

	assert.equal(
		indexes.getIndex( 'true' ),
		0,
		'true should map to index 0'
	);

	assert.equal(
		indexes.getIndex( 'false' ),
		1,
		'false should map to index 1'
	);
}

describe( 'BooleanVariationMapper', function() {
	describe( 'mapVariations', function() {

		const testCases = {
			'undefined': undefined,
			'null': null,
			'empty': {}
		};
		_.forIn( testCases, ( value, name ) => {

			it( `should map ${ name }`, function() {

				const result = mapper.mapVariations( value );

				assertIndexes( result.indexes );
				assert.deepEqual( result.variations, [
					{
						value: true
					},
					{
						value: false
					}
				] );
			} );
		} );

		it( 'should map true & false', function() {

			const result = mapper.mapVariations( {
				false: {
					name: 'Disabled',
					description: 'Disables the feature'
				},
				true: {
					name: 'Enabled',
					description: 'Enables the feature'
				}
			} );

			assertIndexes( result.indexes );
			assert.deepEqual( result.variations, [
				{
					name: 'Enabled',
					description: 'Enables the feature',
					value: true
				},
				{
					name: 'Disabled',
					description: 'Disables the feature',
					value: false
				}
			] );
		} );
	} );
} );