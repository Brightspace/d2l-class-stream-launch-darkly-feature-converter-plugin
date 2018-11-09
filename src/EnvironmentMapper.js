const _ = require( 'lodash' );
const duplicatesDeep = require( './utils.js' ).duplicatesDeep;

module.exports = class EnvironmentMapper {

	constructor( targetsMapper, rulesMapper ) {

		this._targetsMapper = targetsMapper;
		this._rulesMapper = rulesMapper;
	}

	mapEnvironment( definition, variationIndexMap ) {

		const fallthroughVariation = variationIndexMap.getIndex( definition.defaultVariation );

		const targets = _.map(
			definition.targets || [],
			t => this._targetsMapper.mapTarget( t, variationIndexMap )
		);

		const duplciateTargets = duplicatesDeep(
			_.map( targets, t => t.values )
		);
		if( duplciateTargets.length > 0 ) {

			const msg = `Duplicate targets: ${ _.join( duplciateTargets, ', ' ) }`;
			throw new Error( msg );
		}

		const rules = _.map(
			definition.rules || [],
			r => this._rulesMapper.mapRule( r, variationIndexMap )
		);

		const disabled = definition.disabled === true;

		const on =
			!disabled
			&& (
				targets.length > 0
				|| rules.length > 0
			);

		return {
			on,
			targets,
			rules,
			fallthrough: {
				variation: fallthroughVariation
			},
			offVariation: fallthroughVariation
		};
	}
};
