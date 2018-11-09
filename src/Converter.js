const _ = require( 'lodash' );

function validateUniqueTargetVariations( definition, environment ) {

	const visited = new Map();

	const targets = definition.environments[ environment ].targets;
	_.forEach( targets, t => {

		const variation = t.variation;
		if( visited.has( variation ) )  {
			throw new Error( `Duplciate target variations in ${ environment } environment: ${ variation }` );
		}

		visited.set( variation, true );
	} );
}

module.exports = class Converter {

	constructor(
		featureKind,
		schemaValidators,
		variationMapper,
		environmentMapper,
		tags
	) {

		this._featureKind = featureKind;
		this._schemaValidators = schemaValidators;
		this._variationMapper = variationMapper;
		this._environmentMapper = environmentMapper;
		this._tags = tags;
	}

	get schemas() {

		const schemas = _.keys( this._schemaValidators );
		return schemas;
	}

	convert( definition, options, callback ) {

		try {
			this.validate( definition );

			const variationsMap = this._variationMapper.mapVariations( definition.variations );

			const production = this._environmentMapper.mapEnvironment(
				definition.environments.production,
				variationsMap.indexes
			);

			const test = this._environmentMapper.mapEnvironment(
				definition.environments.development,
				variationsMap.indexes
			);

			const tags = _.orderBy(
				_.uniq(
					_.concat(
						this._tags || [],
						definition.tags || []
					)
				)
			);

			const feature = {
				kind: this._featureKind,
				name: definition.name,
				description: definition.description || '',
				variations: variationsMap.variations,
				environments: {
					production,
					test
				},
				tags,
				includeInSnippet: false,
				temporary: true
			};

			return callback( null, feature );

		} catch( err ) {
			return callback( err );
		}
	}

	validate( definition ) {

		const schema = definition.$schema;

		const validator = this._schemaValidators[ schema ];
		if( !validator ) {
			throw new Error( `Unsupported feature definition schema: ${schema}` );
		}

		validator.validate( definition );

		validateUniqueTargetVariations( definition, 'production' );
		validateUniqueTargetVariations( definition, 'development' );
	}
};