module.exports = class InstanceCatalog {

	constructor( tenantIdsByDomainMap ) {
		this._tenantIdsByDomainMap = tenantIdsByDomainMap;
	}

	get isEmpty() {
		return (
			this._tenantIdsByDomainMap.size === 0
		);
	}

	mapTenantDomain( domainName ) {

		const tenantId = this._tenantIdsByDomainMap.get( domainName );
		if( !tenantId ) {
			throw new Error( `Unknown tenant domain: ${ domainName }` );
		}

		return tenantId;
	}
};
