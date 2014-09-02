<?php
	/*
	Plugin Name: mumf-wishlist
	Plugin URI: http://www.github.com/bombadillo/mumf-wishlist
	Description: a wishlist for Woocommerce plugin.
	Version: 0.1.0
	Author: Chris Mumford
	Author URI: http://www.chrisandlaura.co.uk/chris
	License: GPL2
	*/

	/**
	 * Functions
	 */	

	// Called when plugin is activated
	function mumf_wishlist_install() {
		global $wpdb;

		// Define table name
		$table_name = $wpdb->prefix . "mumf_wishlist";

		// If the table does not exist
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ) != $table_name ) {

			// Define the SQL create table statement
		    $sql = "CREATE TABLE $table_name (
				    id int(11) NOT NULL AUTO_INCREMENT,
				    post_id BIGINT(20) UNSIGNED NOT NULL,
				    date DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
				    PRIMARY KEY (id),
				    FOREIGN KEY (post_id) REFERENCES wp_posts(ID)
		    )";

		    // Reference to upgrade.php file
		    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		    // Perform the SQL statement
		    dbDelta( $sql );


		}
		// END if

	}

	// Called when plugin is deactivated
	function mumf_wishlist_uninstall() {
		global $wpdb;

		// Define table name
		$table_name = $wpdb->prefix . "mumf_wishlist";

		// Drop the table
		$wpdb->query("DROP TABLE IF EXISTS $table_name");

	}

	// Adds the wishlist button to the product page
	function mumf_wishlist_add_button() {
		echo '<div class="mumf-wishlist-button-container">
		          <a href="javascript:void(0)" class="single_add_to_wishlist button alt">Add to wishlist</a>
		      </div>';
	}

	// Gets the assets for the plugin
	function mumf_wishlist_get_assets() {

		// Get the styles.
		wp_register_style('mumf-wishlist-styles', plugins_url('/assets/css/main.css', __FILE__ ));
		wp_enqueue_style('mumf-wishlist-styles');	

	}

	/*****************************************************************************/

	/**
	 * Hooks
	 */

	// Register plugin activation hook to install function
	register_activation_hook( __FILE__, 'mumf_wishlist_install' );

	// Register plugin deactivation hook to uninstall function
	register_deactivation_hook(__FILE__, 'mumf_wishlist_uninstall');

	/*****************************************************************************/

	/**
	 * Actions
	 */

	// Calls the function after the product summary has loaded
	add_action('woocommerce_single_product_summary', 'mumf_wishlist_add_button',40); 

	// Calls the function after the product has fully loaded
	add_action('woocommerce_after_single_product', 'mumf_wishlist_get_assets');

	/*****************************************************************************/

?>