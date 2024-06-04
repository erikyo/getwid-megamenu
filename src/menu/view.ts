import MegaMenu from './megaMenu';

/* The code is adding an event listener to the `DOMContentLoaded` event, which is fired when the
initial HTML document has been completely loaded and parsed. When this event is triggered, the code
selects all elements with the class `wp-block-megamenu` using
`document.querySelectorAll('.wp-block-megamenu')`. It then iterates over each of these elements
using the `forEach` method and calls the `initMegamenu` function for each element. This function
initializes the mega menu by attaching event listeners and updating the menu's responsive behavior. */
document.addEventListener( 'DOMContentLoaded', () => {
	const megamenus = document.querySelectorAll(
		'.wp-block-megamenu'
	) as NodeListOf< HTMLElement >;

	/**
	 * For each menu init the above functions
	 */
	megamenus.forEach( ( megamenu ) => new MegaMenu( megamenu ) );
} );
