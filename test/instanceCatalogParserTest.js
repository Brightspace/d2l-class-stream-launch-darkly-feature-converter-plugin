const _ = require( 'lodash' );
const assert = require( 'chai' ).assert;
const instanceCatalogParser = require( '../src/instanceCatalog/instanceCatalogParser.js' );

const instanceCatalog = instanceCatalogParser( [
	{
		instanceId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
		name: 'instance_a',
		tenants: [
			{
				tenantId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
				domains: [
					'www.tenant_c.org'
				]
			}
		]
	},
	{
		instanceId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
		name: 'instance_b',
		tenants: [
			{
				tenantId: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
				domains: [
					'www.tenant_d.org',
					'alt.tenant_d.org'
				]
			}
		]
	}
] );

describe( 'instanceCatalogParser', function() {

	describe( 'mapTenantDomain', function() {

		_.forEach( [
			{
				domain: 'www.tenant_c.org',
				tenantId: 'cccccccc-cccc-cccc-cccc-cccccccccccc'
			},
			{
				domain: 'www.tenant_d.org',
				tenantId: 'dddddddd-dddd-dddd-dddd-dddddddddddd'
			},
			{
				domain: 'alt.tenant_d.org',
				tenantId: 'dddddddd-dddd-dddd-dddd-dddddddddddd'
			}
		], pair => {

			it( `should map org domain: ${pair.domain}`, function() {

				const tenantId = instanceCatalog.mapTenantDomain( pair.domain );
				assert.equal( tenantId, pair.tenantId );
			} );
		} );
	} );

} );