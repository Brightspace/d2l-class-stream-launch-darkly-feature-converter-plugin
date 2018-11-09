const _ = require( 'lodash' );

module.exports = class VariationIndexMap {

	constructor( indexes ) {
		this._indexes = indexes;
	}

	getIndex( variation ) {

		const index = this._indexes[ variation ];

		if( !_.isInteger( index ) ) {
			throw new Error( `Unknown variation key: ${ variation }` );
		}

		return index;
	}
};
