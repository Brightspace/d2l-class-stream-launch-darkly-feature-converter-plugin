const _ = require( 'lodash' );
const VariationIndexMap = require( './VariationIndexMap.js' );

function mapBooleanVariation( definition, value ) {

	const variation = _.pick( definition || {}, [
		'name',
		'description'
	] );

	variation.value = value;

	return variation;
}

module.exports = class BooleanVariationMapper {

	mapVariations( definition ) {

		if( !definition ) {
			definition = {
				true: {},
				false: {}
			};
		}

		const trueVariation = mapBooleanVariation( definition.true, true );
		const falseVariation = mapBooleanVariation( definition.false, false );

		const indexes = {
			'true': 0,
			'false': 1
		};

		const variations = [
			trueVariation,
			falseVariation
		];

		return {
			indexes: new VariationIndexMap( indexes ),
			variations
		};
	}
};
