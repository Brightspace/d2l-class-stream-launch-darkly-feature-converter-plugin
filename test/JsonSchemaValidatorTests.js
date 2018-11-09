const assert = require( 'chai' ).assert;
const JsonSchemaValidator = require( '../src/JsonSchemaValidator.js' );

const validator = new JsonSchemaValidator( {
	$schema: 'http://json-schema.org/draft-06/schema#',
	type: 'object',
	required: [ 'name' ],
	properties: {
		name: {
			type: 'string'
		}
	}
} );

describe( 'JsonSchemaValidationTests', function() {

	it( 'should not throw when valid', function() {
		assert.doesNotThrow( () => {
			validator.validate( {
				name: 'skiddles'
			} );
		} );
	} );

	it( 'should throw when invalid', function() {

		try {
			validator.validate( {
				wacky: true
			} );
			assert( false, 'validator should have thrown' );
		} catch( err ) {

			assert.equal( err.message, 'Invalid feature definition' );
			assert.deepEqual( err.details, [
				{
					dataPath: '',
					keyword: 'required',
					message: 'should have required property \'name\'',
					params: {
						missingProperty: 'name'
					},
					schemaPath: '#/required'
				}
			] );
		}
	} );
} );