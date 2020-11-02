const assert = require( 'chai' ).assert;
const EnvironmentMapper = require( '../src/EnvironmentMapper.js' );
const InstanceCatalog = require( 'd2l-lms-instance-catalog' ).InstanceCatalog;
const TenantRulesMapper = require( '../src/tenant/TenantRulesMapper.js' );
const TenantTargetsMapper = require( '../src/tenant/TenantTargetsMapper.js' );
const VariationIndexMap = require( '../src/variations/VariationIndexMap.js' );

const variationIndexMap = new VariationIndexMap( {
	on: 0,
	off: 1
} );

const mapper = new EnvironmentMapper(
	new TenantTargetsMapper(
		new InstanceCatalog( new Map() )
	),
	new TenantRulesMapper()
);

describe( 'EnvironmentMapper', function() {

	describe( 'mapEnvironment', function() {

		it( 'should throw if targets duplicated', function() {

			const definition = {
				defaultVariation: 'on',
				targets: [
					{
						tenants: [
							'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
						],
						variation: 'on'
					},
					{
						tenants: [
							'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
						],
						variation: 'off'
					}
				]
			};

			assert.throws(
				() => mapper.mapEnvironment( definition, variationIndexMap ),
				/^Duplicate targets: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa$/
			);
		} );

		it( 'should set environment off when no targets and rules', function() {

			const definition = {
				defaultVariation: 'on'
			};

			const expected = {
				on: false,
				targets: [],
				rules: [],
				fallthrough: {
					variation: 0
				},
				offVariation: 0
			};

			assert.deepEqual(
				mapper.mapEnvironment( definition, variationIndexMap ),
				expected
			);
		} );

		it( 'should set environment on when only one target', function() {

			const definition = {
				defaultVariation: 'on',
				targets: [
					{
						tenants: [
							'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
						],
						variation: 'on'
					}
				]
			};

			const expected = {
				on: true,
				targets: [
					{
						values: [ 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' ],
						variation: 0
					}
				],
				rules: [],
				fallthrough: {
					variation: 0
				},
				offVariation: 0
			};

			assert.deepEqual(
				mapper.mapEnvironment( definition, variationIndexMap ),
				expected
			);
		} );

		it( 'should set environment on when one rule', function() {

			const definition = {
				defaultVariation: 'on',
				rules: [
					{
						versions: {
							start: '10.8.4.0'
						},
						variation: 'on'
					}
				]
			};

			const expected = {
				on: true,
				targets: [],
				rules: [
					{
						clauses: [
							{
								attribute: 'productVersion',
								negate: false,
								op: 'greaterThanOrEqual',
								values: [
									10080400000
								]
							}
						],
						variation: 0
					}
				],
				fallthrough: {
					variation: 0
				},
				offVariation: 0
			};

			assert.deepEqual(
				mapper.mapEnvironment( definition, variationIndexMap ),
				expected
			);
		} );

		it( 'should set environment off when disabled', function() {

			const definition = {
				disabled: true,
				defaultVariation: 'on',
				targets: [
					{
						tenants: [
							'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
						],
						variation: 'on'
					}
				]
			};

			const expected = {
				on: false,
				targets: [
					{
						values: [ 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' ],
						variation: 0
					}
				],
				rules: [],
				fallthrough: {
					variation: 0
				},
				offVariation: 0
			};

			assert.deepEqual(
				mapper.mapEnvironment( definition, variationIndexMap ),
				expected
			);
		} );
	} );
} );