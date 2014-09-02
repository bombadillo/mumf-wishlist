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

		$.ajax({
			type: "POST",
			url: oUrls.add,
			data: { productId: productId },
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
		// Encode the data into JSON
		var data = JSON.parse(data);
		console.log(data);
	}

	/*****************************************************************************/

})(jQuery);