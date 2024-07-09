<?php
/**
 * Plugin Name:       Scrippet Block
 * Description:       WordPress plugin to display <a href="https://fountain.io/">Fountain</a> formatted screenplay snippets.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Pierre Carion
 * License:           GPL-3.0
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       scrippet-block
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_scrippet_block_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_scrippet_block_block_init' );
