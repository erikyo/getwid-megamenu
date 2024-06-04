<?php

/**
 * Plugin Name: MegaMenu Block
 * Plugin URI: https://motopress.com/products/wordpress-mega-menu-block/
 * Description: Build better navigation menus with the WordPress mega menu blocks.
 * Version: 991.0.5
 * Author: MotoPress, erikyo
 * Author URI: https://motopress.com/
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: megamenu
 * Domain Path: languages/
 */

defined( 'ABSPATH' ) || exit;

define( 'MEGAMENU_FILE', __FILE__ );

function register_megamenu() {

	$blocks = array(
		'menu',
		'menu-item',
	);

	foreach ( $blocks as $block ) {
		\register_block_type( __DIR__ . '/build/'. $block );
}
}
add_action( 'init', 'register_megamenu' );
