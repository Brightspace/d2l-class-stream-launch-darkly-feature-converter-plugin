const _ = require( 'lodash' );
const InstanceCatalog = require( './InstanceCatalog.js' );

module.exports = function parseInstanceCatalog( instances ) {
	
	const tenantIdsByDomain = new Map();

	_.forEach( instances, instance => {
		_.forEach( instance.tenants, tenant => {
			_.forEach( tenant.domains, domain => {
				tenantIdsByDomain.set( domain, tenant.tenantId );
			} );
		} );
	} );

	return new InstanceCatalog( tenantIdsByDomain );
};
