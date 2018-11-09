const _ = require( 'lodash' );

function duplicatesDeep( arrays ) {

	const visited = new Set();
	const duplicates = new Set();

	const all = _.flattenDeep( arrays );
	_.forEach( all, item => {

		if( visited.has( item ) ) {
			duplicates.add( item );
		} else {
			visited.add( item );
		}
	} );

	return Array.from( duplicates );
}

module.exports = {
	duplicatesDeep
};
