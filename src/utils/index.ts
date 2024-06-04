/**
 * The `calcNewPosition` function calculates the left position, width, and maxWidth of a dropdown menu
 * based on the position and width of the root block node and a maximum width value.
 *
 * @param {{ x: number; width: number } | DOMRect} rootBlockNode           An object that represents the root
 *                                                                         block node. It has two properties: "x" which represents the x-coordinate of the root block node, and
 *                                                                         "width" which represents the width of the root block node.
 * @param {{ x: number } | DOMRect}                blockNode               The `blockNode` parameter represents the position and
 *                                                                         dimensions of a specific block element. It has a property `x` which represents the horizontal
 *                                                                         position of the block.
 * @param {number}                                 [dropdownMaxWidth=2000] The `dropdownMaxWidth` parameter is the maximum width that
 *                                                                         the dropdown can have. If the width of the `rootBlockNode` is greater than `dropdownMaxWidth`, the
 *                                                                         dropdown will be centered within the `rootBlockNode` by adjusting the `left` value.
 * @return an object with three properties: "left", "width", and "maxWidth". The values of these
 * properties are converted to strings and are based on the calculations performed in the function.
 */
export function calcNewPosition(
	rootBlockNode: { x: number; width: number } | DOMRect,
	blockNode: { x: number } | DOMRect,
	dropdownMaxWidth: number = 2000
): { left: string; width: string; maxWidth: string } {
	let left = -( blockNode.x - rootBlockNode.x );

	if ( dropdownMaxWidth && rootBlockNode.width > dropdownMaxWidth ) {
		left = left + ( rootBlockNode.width - dropdownMaxWidth ) / 2;
	}

	return {
		left: left.toString(),
		width: rootBlockNode.width.toString(),
		maxWidth: dropdownMaxWidth.toString(),
	};
}

/**
 * The function sets the left position, width, and maximum width of an HTML element.
 *
 * @param {HTMLElement} el             The `el` parameter is an HTMLElement, which represents the element that
 *                                     you want to set the new position for.
 * @param               style          The `style` parameter is an object that contains three properties: `left`, `width`,
 *                                     and `maxWidth`. Each property represents a CSS style value for the corresponding property of the
 *                                     `el` element. The `left` property represents the left position of the element, the `width` property
 * @param               style.left
 * @param               style.width
 * @param               style.maxWidth
 */
export function setNewPosition(
	el: HTMLElement,
	style: { left: string; width: string; maxWidth: string }
) {
	el.style.left = `${ style.left }px`;
	el.style.width = `${ style.width }px`;
	el.style.maxWidth = `${ style.maxWidth }px`;
}

export function removeStyles( el: HTMLElement, stylesToRemove: string[] ) {
	stylesToRemove.forEach( ( style ) => el.style.removeProperty( style ) );
}

/**
 * The function checks if the current viewport width is less than a specified breakpoint to determine
 * if the device is a mobile device.
 *
 * @param {number} breakpoint The `breakpoint` parameter is a number that represents the maximum
 *                            width of the viewport at which the device is considered to be a mobile device. If the width of the
 *                            viewport is less than the `breakpoint`, the function will return `true`, indicating that the device
 *                            is a mobile device. Otherwise
 * @return A boolean value indicating whether the current viewport width is less than the specified
 * breakpoint.
 */
export function isMobile( breakpoint: number ): boolean {
	return breakpoint !== 0 && document.body.clientWidth < breakpoint;
}

/**
 * The `delay` function is a TypeScript function that returns a promise that resolves after a specified
 * number of milliseconds.
 *
 * @param {number} ms The parameter "ms" is a number that represents the number of milliseconds to
 *                    delay before resolving the promise.
 */
export const delay = ( ms: number ) =>
	new Promise( ( resolve ) => setTimeout( resolve, ms ) );

/**
 * The function `disableBodyScroll` is used to disable scrolling on the body element and apply
 * transformations to the body and megamenu elements.
 *
 * @param [scrollDisabled=false] - A boolean value indicating whether to disable scrolling or not. If
 *                               set to true, scrolling will be disabled. If set to false, scrolling will be enabled.
 */
export function disableBodyScroll( scrollDisabled = false ) {
	const scrollTop = window.scrollY;
	if ( scrollDisabled ) {
		document.body.dataset.scrollTop = scrollTop.toString();
	}

	if ( scrollDisabled ) {
		window.scrollTo( { top: 0 } );
		document.body.classList.add( 'no-scroll' );
	} else {
		document.body.classList.remove( 'no-scroll' );
		window.scrollTo( { top: scrollTop } );
		document.body.removeAttribute( 'data-scroll-top' );
	}
}

/**
 * Converts the characters "&", "<", ">", '"', and "'" in a string to their corresponding HTML entities.
 *
 * @param inputString The string to be converted.
 * @return The converted string with special characters replaced by HTML entities.
 */
export function escapeHtml( inputString: string ): string {
	const htmlEntities: Record< string, string > = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&apos;',
	};

	// Regular expression to match any of the special characters
	const regex = /[&<>"']/g;

	return inputString.replace( regex, ( match ) => htmlEntities[ match ] );
}
