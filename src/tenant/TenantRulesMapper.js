const _ = require( 'lodash' );
const duplicatesDeep = require( '../utils.js' ).duplicatesDeep;
const sortableVersionRangeParser = require( '../sortableVersionRangeParser.js' );

function* mapClauses( definition, instanceCatalog ) {

	if( definition.awsRegions ) {

		const awsRegions = _.orderBy( definition.awsRegions );

		yield {
			attribute: 'awsRegion',
			op: 'in',
			values: awsRegions,
			negate: false
		};
	}

	const versions = sortableVersionRangeParser( definition.versions );
	if( versions ) {

		if( versions.start ) {
			yield {
				attribute: 'productVersion',
				op: 'greaterThanOrEqual',
				values: [ versions.start ],
				negate: false
			};
		}

		if( versions.end ) {
			yield {
				attribute: 'productVersion',
				op: 'lessThanOrEqual',
				values: [ versions.end ],
				negate: false
			};
		}
	}

	const tenantDomains = definition.tenantDomains;
	if( tenantDomains ) {

		if( !versions ) {
			throw new Error( 'Tenants can only be targetted in rules for specific versions' );
		}

		const implicitTenantIds = _.map(
			tenantDomains || [],
			tenantDomain => instanceCatalog.mapTenantDomain( tenantDomain )
		);

		const uniqueTenantIds = _.orderBy(
			_.uniq( implicitTenantIds )
		);

		if( implicitTenantIds.length !== uniqueTenantIds.length ) {

			const duplicates = _.orderBy(
				duplicatesDeep( [
					implicitTenantIds
				] )
			);

			const duplicatesStr = _.join( duplicates, ', ' );
			throw new Error( `Tenant domains are duplicated in rule: ${duplicatesStr}` );
		}

		yield {
			attribute: 'key',
			op: 'in',
			values: uniqueTenantIds,
			negate: false
		};
	}
}

module.exports = class TenantRulesMapper {

	constructor( instanceCatalog ) {
		this._instanceCatalog = instanceCatalog;
	}

	mapRule( definition, variationIndexMap ) {

		const clauses = Array.from( mapClauses( definition, this._instanceCatalog ) );
		const variation = variationIndexMap.getIndex( definition.variation );

		return {
			clauses,
			variation
		};
	}
};
