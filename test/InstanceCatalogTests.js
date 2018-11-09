const assert = require( 'chai' ).assert;
const InstanceCatalog = require( '../src/instanceCatalog/InstanceCatalog.js' );

const instanceCatalog = new InstanceCatalog(
	new Map( [
		['www.tenant_b.org', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb']
	] )
);

describe( 'InstanceCatalog', function() {

	describe( 'mapTenantDomain', function() {

		it( 'should map org domain', function() {

			const tenantId = instanceCatalog.mapTenantDomain( 'www.tenant_b.org' );
			assert.equal( tenantId, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' );
		} );

		it( 'should throw when unknown org domain', function() {

			assert.throws(
				() => instanceCatalog.mapTenantDomain( 'wacky.test.org' ),
				/Unknown tenant domain: wacky.test.org/
			);
		} );

	} );

} );