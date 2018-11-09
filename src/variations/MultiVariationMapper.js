const _ = require( 'lodash' );
const duplicatesDeep = require( '../utils.js' ).duplicatesDeep;
const VariationIndexMap = require( './VariationIndexMap.js' );

function validateAllSameType( values ) {

	let valueType;

	_.forEach( values, value => {

		if( _.isUndefined( valueType ) ) {
			valueType = typeof ( value );

		} else if( valueType !== typeof ( value ) ) {
			throw new Error( 'Variation values must all be of the same type' );
		}
	} );
}

function mapVariation( variation ) {

	const mappedVariation = _.pick( variation, [
		'name',
		'description',
		'value'
	] );

	return mappedVariation;
}

function mapVariationsFromObject( definition ) {

	const allValues = _.map( _.values( definition ), d => d.value );
	validateAllSameType( allValues );

	const duplicateValues = duplicatesDeep( allValues );
	if( duplicateValues.length > 0 ) {

		const msg = `Duplicate variation values: ${ _.join( duplicateValues, ', ' ) }`;
		throw new Error( msg );
	}

	const indexes = {};
	const variations = [];

	let index = 0;

	_.forIn( definition, ( variation, key ) => {
		indexes[ key ] = index;

		const mappedVariation = mapVariation( variation );
		variations.push( mappedVariation );

		index++;
	} );

	return {
		indexes: new VariationIndexMap( indexes ),
		variations
	};
}

function mapVariationsFromArray( definition ) {

	const duplicateKeys = duplicatesDeep(
		_.map( definition, d => d.key )
	);
	if( duplicateKeys.length > 0 ) {

		const msg = `Duplicate variation keys: ${ _.join( duplicateKeys, ', ' ) }`;
		throw new Error( msg );
	}

	const allValues = _.map( definition, d => d.value );
	validateAllSameType( allValues );

	const duplicateValues = duplicatesDeep( allValues );
	if( duplicateValues.length > 0 ) {

		const msg = `Duplicate variation values: ${ _.join( duplicateValues, ', ' ) }`;
		throw new Error( msg );
	}

	const indexes = {};
	const variations = [];

	definition.forEach( ( variation, index ) => {
		indexes[ variation.key ] = index;

		const mappedVariation = mapVariation( variation );
		variations.push( mappedVariation );
	} );

	return {
		indexes: new VariationIndexMap( indexes ),
		variations
	};
}

module.exports = class MultiVariationMapper {

	mapVariations( definition ) {

		if( _.isArray( definition ) ) {
			return mapVariationsFromArray( definition );
		}

		return mapVariationsFromObject( definition );
	}
};
