( function () {
	function enableCirrusSearchLookup( enabled ) {
		const config = mw.config.get( 'wgVisualEditorConfig' );
		config.cirrusSearchLookup = enabled !== false;
		mw.config.set( 'wgVisualEditorConfig', config );
	}

	QUnit.module( 've.ui.MWTemplateTitleInputWidget', QUnit.newMwEnvironment( {
		afterEach() {
			enableCirrusSearchLookup( false );
		}
	} ) );

	QUnit.test( 'default prefixsearch', ( assert ) => {
		const widget = new ve.ui.MWTemplateTitleInputWidget(),
			query = 'a',
			apiParams = widget.getApiParams( query );

		assert.deepEqual( apiParams, {
			action: 'query',
			generator: 'prefixsearch',
			gpslimit: 10,
			gpsnamespace: 10,
			gpssearch: 'a',
			ppprop: 'disambiguation',
			prop: [ 'info', 'pageprops' ],
			redirects: true
		} );
	} );

	QUnit.test( 'CirrusSearch: all API parameters', ( assert ) => {
		enableCirrusSearchLookup();
		const widget = new ve.ui.MWTemplateTitleInputWidget(),
			query = 'a',
			apiParams = widget.getApiParams( query );

		assert.deepEqual( apiParams, {
			action: 'query',
			generator: 'search',
			gsrlimit: 10,
			gsrnamespace: 10,
			gsrprop: 'redirecttitle',
			gsrsearch: 'a*',
			ppprop: 'disambiguation',
			prop: [ 'info', 'pageprops' ],
			redirects: true
		} );
	} );

	QUnit.test( 'CirrusSearch: showRedirectTargets disabled', ( assert ) => {
		enableCirrusSearchLookup();
		const widget = new ve.ui.MWTemplateTitleInputWidget( { showRedirectTargets: false } ),
			apiParams = widget.getApiParams();

		assert.notOk( 'gsrprop' in apiParams );
	} );

	QUnit.test( 'CirrusSearch: prefixsearch behavior', ( assert ) => {
		enableCirrusSearchLookup();
		const widget = new ve.ui.MWTemplateTitleInputWidget();

		[
			{
				query: 'a',
				expected: 'a*'
			},
			{
				query: 'ü',
				expected: 'ü*'
			},
			{
				query: '3',
				expected: '3*'
			},
			{
				query: '!!',
				expected: '!!*'
			}
		].forEach( ( data ) => {
			const apiParams = widget.getApiParams( data.query );

			assert.strictEqual(
				apiParams.gsrsearch,
				data.expected,
				'Searching for ' + data.query
			);
		} );
	} );

	QUnit.test( 'CirrusSearch: redirect is forwarded to the TitleOptionWidget', ( assert ) => {
		enableCirrusSearchLookup();
		const widget = new ve.ui.MWTemplateTitleInputWidget(),
			originalData = { redirecttitle: 'Template:From' },
			data = widget.getOptionWidgetData( 'Template:To', { originalData } );

		assert.strictEqual( data.redirecttitle, 'Template:From' );
	} );

	QUnit.test( 'CirrusSearch: redirect appears in the description', ( assert ) => {
		enableCirrusSearchLookup();
		const widget = new ve.ui.MWTemplateTitleInputWidget();

		let option = widget.createOptionWidget( { redirecttitle: 'Template:From' } );
		assert.strictEqual(
			option.$element.find( '.ve-ui-mwTemplateTitleInputWidget-redirectedfrom' ).text(),
			'(redirectedfrom: From)'
		);

		widget.relative = false;
		option = widget.createOptionWidget( { redirecttitle: 'Template:From' } );
		assert.strictEqual(
			option.$element.find( '.ve-ui-mwTemplateTitleInputWidget-redirectedfrom' ).text(),
			'(redirectedfrom: Template:From)'
		);
	} );
}() );
