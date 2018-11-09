const assert = require( 'chai' ).assert;
const MultiVariationMapper = require( '../src/variations/MultiVariationMapper.js' );

const mapper = new MultiVariationMapper();

describe( 'MultiVariationMapper', function() {
	describe( 'mapVariations', function() {

		describe( 'object definition', function() {
			it( 'should map variations', function() {

				const result = mapper.mapVariations( {
					red: {
						name: 'Red',
						description: 'Things are on fire',
						value: 0
					},
					green: {
						name: 'Green',
						description: 'Things are all ok',
						value: 1
					},
					blue: {
						name: 'Blue',
						description: 'Things are unknown',
						value: 2
					}
				} );

				assert.equal(
					result.indexes.getIndex( 'red' ),
					0,
					'red should map to index 0'
				);

				assert.equal(
					result.indexes.getIndex( 'green' ),
					1,
					'green should map to index 1'
				);

				assert.equal(
					result.indexes.getIndex( 'blue' ),
					2,
					'blue should map to index 2'
				);

				assert.deepEqual( result.variations, [
					{
						name: 'Red',
						description: 'Things are on fire',
						value: 0
					},
					{
						name: 'Green',
						description: 'Things are all ok',
						value: 1
					},
					{
						name: 'Blue',
						description: 'Things are unknown',
						value: 2
					}
				] );
			} );

			it( 'should throw if value types mismatch', function() {

				assert.throws(
					() => {
						mapper.mapVariations( {
							off: {
								name: 'Off',
								description: 'The switch is off',
								value: false
							},
							on: {
								name: 'On',
								description: 'The switch is on',
								value: 'on'
							}
						} );
					},
					/Variation values must all be of the same type/
				);

			} );

			it( 'should map just values', function() {

				const result = mapper.mapVariations( {
					red: {
						value: 0
					},
					green: {
						value: 1
					},
					blue: {
						value: 2
					}
				} );

				assert.equal(
					result.indexes.getIndex( 'red' ),
					0,
					'red should map to index 0'
				);

				assert.equal(
					result.indexes.getIndex( 'green' ),
					1,
					'green should map to index 1'
				);

				assert.equal(
					result.indexes.getIndex( 'blue' ),
					2,
					'blue should map to index 2'
				);

				assert.deepEqual( result.variations, [
					{
						value: 0
					},
					{
						value: 1
					},
					{
						value: 2
					}
				] );
			} );

			it( 'should throw if values duplicated', function() {

				assert.throws(
					() => {
						mapper.mapVariations( {
							off: {
								name: 'Off',
								value: 1
							},
							on: {
								name: 'On',
								value: 1
							}
						} );
					},
					/^Duplicate variation values: 1$/
				);

			} );
		} );

		describe( 'array definition', function() {
			it( 'should map variations', function() {

				const result = mapper.mapVariations( [
					{
						key: 'red',
						name: 'Red',
						description: 'Things are on fire',
						value: 0
					},
					{
						key: 'green',
						name: 'Green',
						description: 'Things are all ok',
						value: 1
					},
					{
						key: 'blue',
						name: 'Blue',
						description: 'Things are unknown',
						value: 2
					}
				] );

				assert.equal(
					result.indexes.getIndex( 'red' ),
					0,
					'red should map to index 0'
				);

				assert.equal(
					result.indexes.getIndex( 'green' ),
					1,
					'green should map to index 1'
				);

				assert.equal(
					result.indexes.getIndex( 'blue' ),
					2,
					'blue should map to index 2'
				);

				assert.deepEqual( result.variations, [
					{
						name: 'Red',
						description: 'Things are on fire',
						value: 0
					},
					{
						name: 'Green',
						description: 'Things are all ok',
						value: 1
					},
					{
						name: 'Blue',
						description: 'Things are unknown',
						value: 2
					}
				] );
			} );

			it( 'should throw if value types mismatch', function() {

				assert.throws(
					() => {
						mapper.mapVariations( [
							{
								key: 'off',
								name: 'Off',
								description: 'The switch is off',
								value: false
							},
							{
								key: 'on',
								name: 'On',
								description: 'The switch is on',
								value: 'on'
							}
						] );
					},
					/Variation values must all be of the same type/
				);

			} );

			it( 'should map just values', function() {

				const result = mapper.mapVariations( [
					{
						key: 'red',
						value: 0
					},
					{
						key: 'green',
						value: 1
					},
					{
						key: 'blue',
						value: 2
					}
				] );

				assert.equal(
					result.indexes.getIndex( 'red' ),
					0,
					'red should map to index 0'
				);

				assert.equal(
					result.indexes.getIndex( 'green' ),
					1,
					'green should map to index 1'
				);

				assert.equal(
					result.indexes.getIndex( 'blue' ),
					2,
					'blue should map to index 2'
				);

				assert.deepEqual( result.variations, [
					{
						value: 0
					},
					{
						value: 1
					},
					{
						value: 2
					}
				] );
			} );

			it( 'should throw if keys duplicated', function() {

				assert.throws(
					() => {
						mapper.mapVariations( [
							{
								key: 'off',
								name: 'Off',
								value: 0
							},
							{
								key: 'off',
								name: 'On',
								value: 1
							}
						] );
					},
					/^Duplicate variation keys: off$/
				);
			} );

			it( 'should throw if values duplicated', function() {

				assert.throws(
					() => {
						mapper.mapVariations( [
							{
								key: 'off',
								name: 'Off',
								value: 1
							},
							{
								key: 'on',
								name: 'On',
								value: 1
							}
						] );
					},
					/^Duplicate variation values: 1$/
				);
			} );
		} );
	} );
} );