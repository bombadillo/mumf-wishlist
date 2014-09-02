(function($) {

	/**
	 * Global Variables
	 **/

	 var oUrls = { add: '/wp-content/plugins/mumf-wishlist/action.php' };

	 /*****************************************************************************/

	/**
	 * Event listeners
	 **/

	 // Listen for the add to wishlist button being clicked
	 $(document).on('click', '.single_add_to_wishlist', function() {

	 	// Get the value of the product id
	 	var productId = $('form.cart').find('input[name=add-to-cart]').val();
	 	// Object to hold our parameters for the request.
	 	var data = { productId: productId, action: 'add' };

		$.ajax({
			type: "POST",
			url: oUrls.add,
			data: data,
			success: onWishListAdd,
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
			console.log(data);
		} 
		// Let's catch any errors
		catch (e) {
			console.log('Data is not in JSON format');
			// Prevent further execution
			return false;
		}
		// END try/catch

	}

	/*****************************************************************************/

})(jQuery);