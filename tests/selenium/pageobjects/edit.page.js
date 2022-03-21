'use strict';
const Page = require( 'wdio-mediawiki/Page' );

class EditPage extends Page {

	get toolbar() { return $( '.ve-init-mw-desktopArticleTarget-toolbar-open' ); }

	openForEditing( title ) {
		super.openTitle( title, { veaction: 'edit', vehidebetadialog: 1, hidewelcomedialog: 1 } );
	}

	activationComplete() {
		return browser.executeAsync( function ( done ) {
			mw.hook( 've.activationComplete' ).add( function () {
				done();
			} );
		} );
	}

}
module.exports = new EditPage();
