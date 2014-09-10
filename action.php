<?php

	// Include the wishlist class
	require_once 'assets/classes/wishlist.class.php';

	// Array to hold response
	$aResponse = [];

	// Check that we have an action
	$sAction = isset($_REQUEST['action']) ? $_REQUEST['action'] : null;
	// Check if we have a wishlist ID
	$iWishlistId = isset($_REQUEST['id']) ? $_REQUEST['id'] : null;

	// If the action is not present, die
	if (!$sAction) {
		$aResponse['message'] = 'An action must be specified.';
		$aResponse['errorCode'] = -1;
		die(json_encode($aResponse));
	}	
	// END if

	// If there's a wishlist ID, check it's numeric
	if ($iWishlistId && !is_numeric($iWishlistId)) {
		$aResponse['message'] = 'The wishlist ID must be numeric.';
		$aResponse['errorCode'] = -1;
		die(json_encode($aResponse));
	}
	// END if


	// Create instance of wishlist class
	$myWishlist = new Wishlist();

	// If the user id < 1 then we don't have a user
	if ($myWishlist->user_id < 1) {
		$aResponse['message'] = 'You must be logged in to add an item to your wishlist.';
		$aResponse['errorCode'] = -1;
		die(json_encode($aResponse));
	}

	// Switch the action
	switch ($sAction) {

		// Getting all wishlist items
		case 'getAll':

			// Otherwise we'll call class function to add it to wishlist
			$bSuccessful = $myWishlist->getAll();

			// If no rows are returned
			if (!$bSuccessful) {
				$aResponse['message'] = 'There are no items in your wishlist.';
				$aResponse['errorCode'] = -1;
				die(json_encode($aResponse));
			}			
			// END if

			// Otherwise set the response array's data property to the rows returned
			$aResponse['data'] = $myWishlist->fullWishlist;

			break;

		// Adding a wishlist item
		case 'add':
			// Call class function to identify if the product is already in user wishlist
			$bExists = $myWishlist->getFromWishlistWithPostId($iWishlistId);		

			// If the item exists
			if ($bExists) {
				$aResponse['message'] = 'The item is already in your wishlist.';
				$aResponse['errorCode'] = -1;
				die(json_encode($aResponse));
			}			
			// END if

			// Otherwise we'll call class function to add it to wishlist
			$bSuccessful = $myWishlist->addToWishlist($iWishlistId);

			// Set the result based on if the add was successful
			$iResult = $bSuccessful ? 1 : 0;

			// Set the error code to the boolean(1 or 0)
			$aResponse['errorCode'] = $iResult;			
			break;

		// Deleting a wishlist item
		case 'delete':

			// Call class function to identify if the product is already in user wishlist
			$bExists = $myWishlist->getFromWishlist($iWishlistId);		

			// If the item does not exist
			if (!$bExists) {
				$aResponse['message'] = 'The item is not in in your wishlist.';
				$aResponse['errorCode'] = -1;
				die(json_encode($aResponse));
			}	
			// END if

			// Otherwise we'll call class function to add it to wishlist
			$bSuccessful = $myWishlist->deleteFromWishlist($iWishlistId);

			// Set the result based on if the add was successful
			$iResult = $bSuccessful ? 1 : 0;

			// Set the error code to the boolean(1 or 0)
			$aResponse['errorCode'] = $iResult;							
			break;
	}

	// Send the array encoded as JSON
	echo json_encode($aResponse);