<?php

	// Array to hold response
	$aResponse = [];

	// Check that we have an action
	$sAction = isset($_REQUEST['action']) ? $_REQUEST['action'] : null;

	// If the action is not present, die
	if (!$sAction) {
		$aResponse['message'] = 'An action must be specified.';
		$aResponse['errorCode'] = -1;
		die(json_encode($aResponse));
	}	
	// END if

	// Switch the action
	switch ($sAction) {
		case 'add':
			
			break;
	}