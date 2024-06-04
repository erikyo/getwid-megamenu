/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function save( {
	attributes,
}: {
	attributes: {
		activator: string;
		expandDropdown: boolean;
		collapseOnMobile: boolean;
		responsiveBreakpoint: number;
		dropdownMaxWidth: number;
	};
} ): JSX.Element {
	const saveBlockProps = useBlockProps.save( {
		className: classnames( 'wp-block-megamenu__content' ),
	} );

	return (
		<>
			<nav
				className={ classnames(
					'wp-block-megamenu',
					`activator-${ attributes.activator }`,
					{
						[ `has-full-width-dropdown` ]:
							attributes.expandDropdown ||
							attributes.dropdownMaxWidth === 0,
						[ `is-collapsible` ]: attributes.collapseOnMobile,
					}
				) }
				data-responsive-breakpoint={ attributes.responsiveBreakpoint }
				data-dropdown-width={ attributes.dropdownMaxWidth }
			>
				<div { ...saveBlockProps }>
					<InnerBlocks.Content />
				</div>
			</nav>
			<div
				className={ classnames(
					'wp-block-megamenu__toggle-wrapper',
					'is-hidden'
				) }
			>
				<button
					className="wp-block-megamenu__toggle hamburger"
					aria-label="Toggle megamenu"
				>
					<div></div>
				</button>
			</div>
		</>
	);
}
