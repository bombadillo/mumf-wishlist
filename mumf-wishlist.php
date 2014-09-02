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

	// Register plugin activation hook to install function
	register_activation_hook( __FILE__, 'mumf_wishlist_install' );

	// Register plugin deactivation hook to uninstall function
	register_deactivation_hook(__FILE__, 'mumf_wishlist_uninstall');

?>