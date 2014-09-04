(function($) {

	/**
	 * Global Variables
	 **/

	 var oUrls = { actions: '/wp-content/plugins/mumf-wishlist/action.php' };

	 /*****************************************************************************/

	/**
	 * Event listeners
	 **/

	// Listen for DOM load
	$(document).on('ready', function() {
		// Call function to add the view wishlist button
		addViewWishlistToMenu();
	});

	// Listen for the add to wishlist button being clicked
	$(document).on('click', '.single_add_to_wishlist', function() {

		// Get the value of the product id
		var productId = $('form.cart').find('input[name=add-to-cart]').val();
		// Object to hold our parameters for the request.
		var data = { id: productId, action: 'add' };

		$.ajax({
			type: "POST",
			url: oUrls.actions,
			data: data,
			success: onWishListAdd,
			dataType: 'text'
		});	 	

	});

	// Listen for the view wishlist button being clicked
	$(document).on('click', '.mumf-wishlist-view', function() {
		// Object to hold our parameters for the request.
		var data = { action: 'getAll' };

		$.ajax({
			type: "POST",
			url: oUrls.actions,
			data: data,
			success: onWishListGetAll,
			dataType: 'text'
		});	 
	});

	 /*****************************************************************************/

	/**
	 * Functions
	**/

	// When the response for add from the server is successful
	function onWishListAdd(data) {

		// Attempt JSON encode
		try {
			// Encode the data into JSON
			var data = JSON.parse(data);			
		} 
		// Let's catch any errors
		catch (e) {
			console.log('Data is not in JSON format');
			// Prevent further execution
			return false;
		}
		// END try/catch

		// Get the product title
		var productTitle = $('.product_title').html();

		// If there are no errors
		if (data.errorCode > 0) {			
			// Set the message HTML
			var messageHtml = '<div class="woocommerce-message mumf-wishlist-message"><a class="button mumf-wishlist-view" href="javascript:void(0)">View wishlist</a> '+ productTitle +' was successfully added to your wishlist.</div>';
		// Otherwise there are errors
		} else {
			// Set the message or use default
			var message = data.message ? data.message : 'Unable to add product to wishlist';
			// Set the message HTML
			var messageHtml = '<div class="woocommerce-error mumf-wishlist-message">'+ message +'</div>';
		}
		// END if errors

		// Slide up any errormessages
		$('.mumf-wishlist-message').slideUp(function() {
			$(this).remove();
		});

		// Prepend to #content element
		$('#content').prepend(messageHtml);

		// Slide down the message
		$('.mumf-wishlist-message').slideDown();

	}

	// When the response for get all from the server is successful
	function onWishListGetAll(data) {
		// Attempt JSON encode
		try {
			// Encode the data into JSON
			var data = JSON.parse(data);			
		} 
		// Let's catch any errors
		catch (e) {
			console.log('Data is not in JSON format');
			// Prevent further execution
			return false;
		}
		// END try/catch

		// Check if there's errors
		if (data.errorCode < 1) {
			// Set the message or use default
			var message = data.message ? data.message : 'Unable to retrieve wishlist :(';
			// Set the message HTML
			var messageHtml = '<div class="woocommerce-error mumf-wishlist-message">'+ message +'</div>';
			
			// Slide up any errormessages
			$('.mumf-wishlist-message').slideUp(function() {
				$(this).remove();
			});

			// Prepend to #content element
			$('#content').prepend(messageHtml);

			// Slide down the message
			$('.mumf-wishlist-message').slideDown();
		}
		// END if errors

	}

	// Adds a button to the main menu to view the wishlist
	function addViewWishlistToMenu() {
		// Set the HTML
		var html = '<li class="page_item"><a href="javascript:void(0)" class="mumf-wishlist-view">My Wishlist</a></li>';

		// Append to main nav
		$('#main-nav').append(html);
	}

	/*****************************************************************************/

})(jQuery);