const _ = require( 'lodash' );
const duplicatesDeep = require( '../utils.js' ).duplicatesDeep;

module.exports = class TenantTargetsMapper {

	constructor( instanceCatalog ) {
		this._instanceCatalog = instanceCatalog;
	}

	mapTarget( definition, variationIndexMap ) {

		const variation = variationIndexMap.getIndex( definition.variation );

		const implicitTenantIds = _.map(
			definition.tenantDomains || [],
			tenantDomain => this._instanceCatalog.mapTenantDomain( tenantDomain )
		);

		const explicitTenantIds = _.map(
			definition.tenants || [],
			tenant => {

				if( _.isString( tenant ) ) {
					return tenant;
				}

				return tenant.tenantId;
			}
		);

		const allTenantIds = _.concat(
			implicitTenantIds,
			explicitTenantIds
		);

		const uniqueTenantIds = _.orderBy(
			_.uniq( allTenantIds )
		);

		if( allTenantIds.length !== uniqueTenantIds.length ) {

			const duplicates = _.orderBy(
				duplicatesDeep( [
					implicitTenantIds,
					explicitTenantIds
				] )
			);

			const duplicatesStr = _.join( duplicates, ', ' );
			throw new Error( `Tenants are duplicated: ${duplicatesStr}` );
		}

		return {
			values: uniqueTenantIds,
			variation
		};
	}
};
