(function($) {

	/**
	 * Global Variables
	 **/

	 var oUrls = { actions: '/wp-content/plugins/mumf-wishlist/action.php' };
	 var elWishlistModal = '.mumf-wishlist-modal';
	 var elWishlistOverlay = '.mumf-wishlist-overlay';
	 var elWishlistModalContainer = '.mumf-wishlist-modal-container';
	 var elWishlistItemContainer = '.mumf-wishlist-item-container';

	 var mumfWishlistCurrentDeleteId = undefined;
	 var mumfWishlistCurrentWishlist = undefined;

	 /*****************************************************************************/

	/**
	 * Event listeners
	 **/

	// Listen for DOM load
	$(document).on('ready', function() {
		// Call function to add the view wishlist button
		addViewWishlistToMenu();
		// Call function to add overlay and modal elements
		setupModalOverlay();
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
			type: "GET",
			url: oUrls.actions,
			data: data,
			success: onWishListGetAll,
			dataType: 'text'
		});	 
	});

	// Listen for the remove wishlist item button being clicked
	$(document).on('click', '.mumf-wishlist-remove', function(e) {

		// Get the value of the product id
		var productId = $(e.currentTarget).data('id');
		// Object to hold our parameters for the request.
		var data = { id: productId, action: 'delete' };

		// Set the current delete id
		mumfWishlistCurrentDeleteId = productId;

		$.ajax({
			type: "POST",
			url: oUrls.actions,
			data: data,
			success: onWishListDelete,
			dataType: 'text'
		});	 
	});

	// Listen for click on child
	$(document).on('click', '.mumf-wishlist-modal', function(e) {
		e.stopPropagation();
	});


	// Listen for click on overlay
	$(document).on('click', '.mumf-wishlist-modal-container', function(e) {		
		// Call function to hide modal
		hideModal();
	});	
	
	// Listen for click on message close button
	$(document).on('click', '.mumf-wishlist-message .close', function(e) {		
		// Slide up parent
		$(this).parent().slideUp(function() {
			// Remove the element
			$(this).remove();
		});
	});		

	// Listen for click on modal close button
	$(document).on('click', '.mumf-wishlist-modal .close', function(e) {		
		// Call function to hide modal
		hideModal();
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
			var messageHtml = '<div class="woocommerce-message mumf-wishlist-message"><a class="button mumf-wishlist-view" href="javascript:void(0)">View wishlist</a> '+ productTitle +' was successfully added to your wishlist. <div class="close">x</div></div>';
		// Otherwise there are errors
		} else {
			// Set the message or use default
			var message = data.message ? data.message : 'Unable to add product to wishlist';
			// Set the message HTML
			var messageHtml = '<div class="woocommerce-error mumf-wishlist-message">'+ message +'<div class="close">x</div></div>';
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

	// When the response for delete from the server is successful
	function onWishListDelete(data) {
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

		// If there are no errors
		if (data.errorCode > 0) {			

			// Slide down the element
			$('.mumf-wishlist-modal .item-'+ mumfWishlistCurrentDeleteId).fadeOut(function() {
				$(this).remove();
			});

			// Deduct one from the list length
			--mumfWishlistCurrentWishlist;

			// If the array is empty, call function to hide the modal
			if (mumfWishlistCurrentWishlist < 1) hideModal();
				
		// Otherwise there are errors
		} else {
			// 
		}
		// END if errors		

		// Reset the id
		mumfWishlistCurrentDeleteId = undefined;
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
			var messageHtml = '<div class="woocommerce-error mumf-wishlist-message">'+ message +'<div class="close">x</div></div>';
			
			// Slide up any errormessages
			$('.mumf-wishlist-message').slideUp(function() {
				$(this).remove();
			});

			// Prepend to #content element
			$('#content').prepend(messageHtml);

			// Slide down the message
			$('.mumf-wishlist-message').slideDown();
		// Otherwise there's no errors
		} else {
			// Set to the global variable
			mumfWishlistCurrentWishlist = data.data.length;

			// Call function to show wishlist in modal
			showWishListModal(data.data);
		}
		// END if errors

	}

	function showWishListModal(aList) {
		
		// Set html
		var html = '<div class="close">x</div><h3>Your Wishlist</h3><div class="mumf-wishlist-item-container">';

		// Loop each of the items in array
		for (var i = 0; i < aList.length; i++) {
			// Current item in array
			var item = aList[i];
			// Add list item
			html += '<div class="item item-'+ item.id +'"><div class="title">'+ item.title +'</div><div class="image-container"><a href="'+ item.link +'" alt="'+ item.title +'">'+ item.thumbnail +'</a></div> <div class="mumf-wishlist-buttons"><a href="'+ item.link +'" class="button">View</a><a href="javascript:void(0)" class="button mumf-wishlist-remove" data-id="'+ item.id+ '">X</a></div></div>'; 
		}

		// End ul
		html += '</div>';

		// Fade in the overlay
		$(elWishlistOverlay).fadeIn();

		// Populate the modal
		$(elWishlistModal).html(html);

		// Get the length of the array
		var length = aList.length;
		// Var to hold the eventual margin top value
		var marginTop = undefined;

		// If there are <= than 4 items
		if (length <= 4) {
			marginTop = 200;
		// Or if there are <= 8
		} else if (length <= 8) {
			marginTop = 135;
		} else {
			marginTop = 35;
		}
		// END if

		// Set the margin top for the modal
		$(elWishlistModal).css('margin-top', marginTop + 'px');



		// Fade in the modal container
		$(elWishlistModalContainer).fadeIn();


		// If the length is > than 8 
		if (length > 8) {
			// Get the document height
			var docHeight = $(window).height(); 
			// Get the offset of the item container
			var offset = $(elWishlistItemContainer).offset().top;
			// Create new height
			var itemContainerHeight = docHeight - offset - 20;
			// Assign to css
			$(elWishlistItemContainer).css('height', itemContainerHeight);			
		}
		// END if

	}

	function hideModal() {
		// Fade in the overlay
		$(elWishlistOverlay).fadeOut();

		// Populate the modal
		$(elWishlistModalContainer).fadeOut();
	}

	// Adds a button to the main menu to view the wishlist
	function addViewWishlistToMenu() {
		// Set the HTML
		var html = '<li class="page_item"><a href="javascript:void(0)" class="mumf-wishlist-view">My Wishlist</a></li>';

		// Append to main nav
		$('#main-nav').append(html);
	}

	function setupModalOverlay() {
		// Set the HTML
		var html = '<div class="mumf-wishlist-overlay"></div><div class="mumf-wishlist-modal-container"><div class="mumf-wishlist-modal"></div></div>';

		// Append to main nav
		$('body').append(html);
	}

	/*****************************************************************************/

})(jQuery);