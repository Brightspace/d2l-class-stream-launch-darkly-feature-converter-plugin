const Ajv = require( 'ajv' );

const ajv = new Ajv();
ajv.addMetaSchema( require( 'ajv/lib/refs/json-schema-draft-06.json' ) );

class JsonValidationError extends Error {

	constructor( message, details, ...args ) {
		super( message, ...args );

		this.details = details;
		Error.captureStackTrace( this, JsonValidationError );
	}
}

module.exports = class JsonSchemaValidator {

	constructor( schema ) {
		this._schemaValidator = ajv.compile( schema );
	}

	validate( json ) {

		const valid = this._schemaValidator( json );
		if( valid ) {
			return;
		}

		const details = this._schemaValidator.errors;
		throw new JsonValidationError( 'Invalid feature definition', details );
	}
};
