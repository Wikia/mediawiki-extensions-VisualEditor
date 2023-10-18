'use strict';

const assert = require( 'assert' ),
	EditPage = require( '../pageobjects/edit.page' ),
	FixtureContent = require( '../fixturecontent' ),
	LoginPage = require( 'wdio-mediawiki/LoginPage' ),
	UserPreferences = require( '../userpreferences' ),
	Util = require( 'wdio-mediawiki/Util' );

describe( 'CodeMirror textSelection for the wikitext 2010 editor', () => {
	let title;

	before( async () => {
		title = Util.getTestString( 'CodeMirror-fixture1-' );
		await LoginPage.loginAdmin();
		await FixtureContent.createFixturePage( title );
		await UserPreferences.enableWikitext2010EditorWithCodeMirror();
		await EditPage.openForEditing( title, true );
		await EditPage.wikiEditorToolbar.waitForDisplayed();
		await EditPage.clickText();
	} );

	it( 'sets and gets the correct text when using setContents and getContents', async () => {
		await browser.execute( () => $( '.cm-editor' ).textSelection( 'setContents', 'foobar' ) );
		assert.strictEqual(
			await browser.execute( () => $( '.cm-editor' ).textSelection( 'getContents' ) ),
			'foobar'
		);
	} );

	it( 'sets and gets the correct selection when using setSelection and getSelection', async () => {
		await browser.execute( () => {
			$( '.cm-editor' ).textSelection( 'setSelection', { start: 3, end: 6 } );
		} );
		assert.strictEqual(
			await browser.execute( () => {
				return $( '.cm-editor' ).textSelection( 'getSelection' );
			} ),
			'bar'
		);
	} );

	it( 'correctly replaces the selected text when using replaceSelection', async () => {
		await browser.execute( () => $( '.cm-editor' ).textSelection( 'replaceSelection', 'baz' ) );
		assert.strictEqual(
			await browser.execute( () => $( '.cm-editor' ).textSelection( 'getContents' ) ),
			'foobaz'
		);
	} );

	it( 'returns the correct values for getCaretPosition', async () => {
		await browser.execute( () => {
			$( '.cm-editor' ).textSelection( 'setSelection', { start: 3, end: 6 } );
		} );
		assert.strictEqual(
			await browser.execute( () => $( '.cm-editor' ).textSelection( 'getCaretPosition' ) ),
			6
		);
		assert.deepStrictEqual(
			await browser.execute( () => {
				return $( '.cm-editor' ).textSelection( 'getCaretPosition', { startAndEnd: true } );
			} ),
			[ 3, 6 ]
		);
	} );

	it( 'scrolls to the correct place when using scrollToCaretPosition', async () => {
		await browser.execute( () => {
			const $cmEditor = $( '.cm-editor' );
			$cmEditor.textSelection( 'setContents', 'foobar\n'.repeat( 50 ) );
			// Ensure caret is at the top.
			$cmEditor.textSelection( 'setSelection', { start: 0 } );
			// Force scrolling to the bottom.
			$( '.cm-scroller' )[ 0 ].scrollTop = 5000;
			// Use textSelection to scroll back to caret.
			$cmEditor.textSelection( 'scrollToCaretPosition' );
		} );
		assert.strictEqual(
			await browser.execute( () => $( '.cm-scroller' ).scrollTop() ),
			0
		);
	} );

	it( 'retains the contents after turning CodeMirror off', async () => {
		await EditPage.legacyCodeMirrorButton.click();
		await EditPage.legacyTextInput.waitForDisplayed();
		assert.match( await EditPage.legacyTextInput.getValue(), /foobar/ );
	} );
} );
