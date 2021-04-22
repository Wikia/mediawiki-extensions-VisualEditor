<?php

namespace MediaWiki\Extension\VisualEditor;

/**
 * VisualEditorHookRunner
 *
 * @file
 * @ingroup Extensions
 * @copyright 2011-2021 VisualEditor Team and others; see AUTHORS.txt
 * @license MIT
 */

use MediaWiki\HookContainer\HookContainer;
use MediaWiki\Page\ProperPageIdentity;
use MediaWiki\User\UserIdentity;

class VisualEditorHookRunner implements VisualEditorApiVisualEditorEditPostSaveHook {

	public const SERVICE_NAME = 'VisualEditorHookRunner';

	/** @var HookContainer */
	private $hookContainer;

	/**
	 * @param HookContainer $hookContainer
	 */
	public function __construct( HookContainer $hookContainer ) {
		$this->hookContainer = $hookContainer;
	}

	/** @inheritDoc */
	public function onVisualEditorApiVisualEditorEditPostSave(
		ProperPageIdentity $page,
		UserIdentity $user,
		string $wikitext,
		array $params,
		array $pluginData,
		array $saveResult,
		array &$apiResponse
	): void {
		$this->hookContainer->run( 'VisualEditorApiVisualEditorEditPostSave', [
			$page,
			$user,
			$wikitext,
			$params,
			$pluginData,
			$saveResult,
			&$apiResponse
		], [ 'abortable' => false ] );
	}
}
