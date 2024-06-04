/**
 * External dependencies
 */
import { compose } from '@wordpress/compose';
/**
 * WordPress dependencies
 */
import { useRef, useState } from '@wordpress/element';
import classnames from 'classnames';
import { Controls } from './controls';
import { InnerBlocks, useInnerBlocksProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import type { Template } from '@wordpress/blocks';
import { withSelect } from '@wordpress/data';

const TEMPLATE = [
	[
		'core/group',
		{
			layout: {
				type: 'flex',
				flexWrap: 'nowrap',
				verticalAlignment: 'stretch',
			},
		},
		[ [ 'megamenu/menu-item', {} ] ],
	],
] as Template[];

const ALLOWED_BLOCKS = [
	'megamenu/menu-item',
	'codekraft/oh-my-svg',
	'core/group',
	'core/site-logo',
	'core/social-link',
];

function MegaMenu( args ) {
	const {
		selectedBlockHasDescendants,
		isImmediateParentOfSelectedBlock,
		isSelected,
		attributes,
	} = args;

	const [ showResponsiveMenu, setShowResponsiveMenu ] = useState( false );
	const ref = useRef( null );

	return (
		<div>
			<Controls
				{ ...args }
				showResponsiveMenu={ showResponsiveMenu }
				setShowResponsiveMenu={ setShowResponsiveMenu }
			/>
			<nav
				className={ classnames(
					'wp-block-megamenu',
					`activator-${ attributes.activator }`,
					{
						'is-hidden': showResponsiveMenu,
						[ `has-full-width-dropdown` ]:
							attributes.expandDropdown ||
							attributes.dropdownMaxWidth === 0,
						[ `is-collapsible` ]: attributes.collapseOnMobile,
					}
				) }
				data-responsive-breakpoint={ attributes.responsiveBreakpoint }
				data-dropdown-content-width={ attributes.dropdownMaxWidth }
			>
				<div className={ 'wp-block-megamenu__content' }>
					<InnerBlocks
						ref={ ref }
						template={ TEMPLATE }
						templateLock={ false }
						allowedBlocks={ ALLOWED_BLOCKS }
						templateInsertUpdatesSelection={ false }
						renderAppender={
							( isImmediateParentOfSelectedBlock &&
								! selectedBlockHasDescendants ) ||
							isSelected
								? InnerBlocks.DefaultBlockAppender
								: undefined
						}
						orientation="horizontal"
					/>
				</div>
			</nav>
			<div
				className={ classnames(
					'wp-block-megamenu__toggle-wrapper',
					`align-${ attributes.menuAlign || 'right' }`,
					{
						'is-hidden': ! showResponsiveMenu,
					}
				) }
			>
				<Button className="wp-block-megamenu__toggle hamburger">
					<div></div>
				</Button>
			</div>
		</div>
	);
}

export default compose( [
	withSelect( ( select, { clientId } ) => {
		const {
			getClientIdsOfDescendants,
			hasSelectedInnerBlock,
			getSelectedBlockClientId,
			getBlocksByClientId,
		} = select( 'core/block-editor' );
		const isImmediateParentOfSelectedBlock = hasSelectedInnerBlock(
			clientId,
			false
		);
		const selectedBlockId = getSelectedBlockClientId();
		const selectedBlockHasDescendants = !! getClientIdsOfDescendants( [
			selectedBlockId,
		] )?.length;
		const menuItems = getBlocksByClientId( clientId )[ 0 ].innerBlocks;

		return {
			isImmediateParentOfSelectedBlock,
			selectedBlockHasDescendants,
			menuItems,
		};
	} ),
] as any )( MegaMenu );
