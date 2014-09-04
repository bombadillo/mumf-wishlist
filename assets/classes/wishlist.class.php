<?php

require_once("{$_SERVER['DOCUMENT_ROOT']}/wp-load.php");

class Wishlist {

	// Set private variables
	private $user_id;

	function __construct() {
		// Set the current user for the class
		global $current_user;
		get_currentuserinfo();

		$this->user_id = $current_user->ID;		
	}
	
	/**
	 * Name:     getFromWishlist
	 * Purpose:  To get a single item from the wishlist
	 * Params:   {int} iWishlistId   The id of the item to retrieve
	 * Returns:  +ve true
	 *		     -ve false
	 */
	public function getFromWishlist($iWishlistId) {
		global $wpdb;

		// Prepare the query with params
		$sql = $wpdb->prepare('SELECT id FROM wp_mumf_wishlist where id = %s AND user_id = %d', $iWishlistId, $this->user_id);

		// Submit query
		$wpdb->query($sql);

		// Return the number of rows
		return $wpdb->result->num_rows > 0;
	}

	/**
	 * Name:     getFromWishlist
	 * Purpose:  To get a single item from the wishlist
	 * Params:   {int} iWishlistId   The post id of the item to retrieve
	 * Returns:  +ve true
	 *		     -ve false
	 */
	public function getFromWishlistWithPostId($iWishlistId) {
		global $wpdb;

		// Prepare the query with params
		$sql = $wpdb->prepare('SELECT id FROM wp_mumf_wishlist where post_id = %s AND user_id = %d', $iWishlistId, $this->user_id);

		// Submit query
		$wpdb->query($sql);

		// Return the number of rows
		return $wpdb->result->num_rows > 0;
	}
	

	/**
	 * Name:     getAll
	 * Purpose:  To get the entire wishlist
	 * Returns:  +ve true
	 *		     -ve false
	 */
	public function getAll() {
		global $wpdb;

		// Create date
		$date = new DateTime();
		
		// Prepare the query with params
		$wpdb->query("SELECT * FROM wp_mumf_wishlist WHERE user_id = $this->user_id");

		// Set the classes fullWishlist to the new result
		$this->fullWishlist = $wpdb->last_result;

		// Loop the wishlist
		foreach ($this->fullWishlist as $key => $value) {
			// Get the permalink
			$permalink = get_permalink($value->post_id);
			// Get the title
			$title = get_the_title($value->post_id);
			// Get the thumbnail
			$thumbnail = get_the_post_thumbnail($value->post_id, 'thumbnail'); 

			// Add permalink to wishlist item
			$value->link = $permalink;
			// Add title to wishlist item
			$value->thumbnail = $thumbnail;
			// Add thumbnail to wishlist item
			$value->thumbnail = $thumbnail;
		}

		// Return the number of rows
		return $wpdb->result->num_rows > 0;
	}	

	/**
	 * Name:     addToWishlist
	 * Purpose:  To add a single item to the wishlist
	 * Params:   {int} iWishlistId   The post id of the item to add
	 * Returns:  +ve true
	 *		     -ve false
	 */
	public function addToWishlist($iWishlistId) {
		global $wpdb;

		// Create date
		$date = new DateTime();
		
		// Prepare the query with params
		$sql = $wpdb->prepare("INSERT INTO wp_mumf_wishlist (post_id, user_id, date) VALUES (%s, %d, %s)", $iWishlistId, $this->user_id, $date->format('Y-m-d H:i:s'));

		// Submit query
		$wpdb->query($sql);

		// Return the number of rows
		return $wpdb->result > 0;
	}

	/**
	 * Name:     deleteFromWishlist
	 * Purpose:  To delete a single item from the wishlist
	 * Params:   {int} iWishlistId   The post id of the item to delete
	 * Returns:  +ve true
	 *		     -ve false
	 */
	public function deleteFromWishlist($iWishlistId) {
		global $wpdb;

		// Prepare the query with params
		$sql = $wpdb->prepare("DELETE FROM wp_mumf_wishlist WHERE id = %s && user_id = %d", $iWishlistId, $this->user_id);

		// Submit query
		$wpdb->query($sql);

		// Return the number of rows
		return $wpdb->result > 0;
	}

}