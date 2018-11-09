const _ = require( 'lodash' );
const Converter = require( './Converter.js' );
const EnvironmentMapper = require( './EnvironmentMapper.js' );
const JsonSchemaValidator = require( './JsonSchemaValidator.js' );

const loadInstanceCatalog = require( './instanceCatalog/instanceCatalogLoader.js' );

const TenantRulesMapper = require( './tenant/TenantRulesMapper.js' );
const TenantTargetsMapper = require( './tenant/TenantTargetsMapper.js' );

const BooleanVariationMapper = require( './variations/BooleanVariationMapper.js' );
const MultiVariationMapper = require( './variations/MultiVariationMapper.js' );

const tenantBooleanSchemaV1_0 = require( '../schemas/tenant-boolean/v1_0.json' );

const tenantMultivariateSchemaV1_0 = require( '../schemas/tenant-multivariate/v1_0.json' );

const booleanFeatureKind = 'boolean';
const multivariateFeatureKind = 'multivariate';

const generateFlagTag = 'class-stream-generated-flag';
const tenantFlagTag = 'class-stream-tenant-flag';

function createSchemaValiators( schemas ) {

	const validators = {};

	_.forEach( schemas, schema => {
		validators[ schema.$id ] = new JsonSchemaValidator( schema );
	} );

	return validators;
}

function* createConverters( instanceCatalog ) {

	const booleanVariationMapper = new BooleanVariationMapper();
	const multiVariationMapper = new MultiVariationMapper();

	const tenantTargetsMapper = new TenantTargetsMapper( instanceCatalog );
	const tenantRulesMapper = new TenantRulesMapper( instanceCatalog );
	const tenantEnvironmentMapper = new EnvironmentMapper( tenantTargetsMapper, tenantRulesMapper );

	yield new Converter(
		booleanFeatureKind,
		createSchemaValiators( [
			tenantBooleanSchemaV1_0
		] ),
		booleanVariationMapper,
		tenantEnvironmentMapper,
		[ generateFlagTag, tenantFlagTag ]
	);

	yield new Converter(
		multivariateFeatureKind,
		createSchemaValiators( [
			tenantMultivariateSchemaV1_0
		] ),
		multiVariationMapper,
		tenantEnvironmentMapper,
		[ generateFlagTag, tenantFlagTag ]
	);
}

module.exports = function( options, callback ) {

	loadInstanceCatalog( ( err, instanceCatalog ) => {

		if( err ) {
			return callback( err );
		}

		const converters = Array.from( createConverters( instanceCatalog ) );
		return callback( null, converters );
	} );
};
