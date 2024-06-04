/**
 * External dependencies
 */
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import Controls from './controls';
import { useEffect, useRef, useState } from '@wordpress/element';
import {
	RichText,
	InnerBlocks,
	store as blockEditorStore, useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { withDispatch, withSelect } from '@wordpress/data';
import { Icon } from '@wordpress/components';
import { chevronDown } from '@wordpress/icons';
import { calcNewPosition } from '../utils';
import { compose } from '@wordpress/compose';

type DropDownCoords =
	| { left: number; width: number; maxWidth: number }
	| DOMRect;

/**
 * Internal dependencies
 *
 * @param props
 */
function Edit( props ) {
	const {
		attributes,
		setAttributes,
		isSelected,
		onReplace,
		mergeBlocks,
		isParentOfSelectedBlock,
		hasDescendants,
		updateInnerBlocks,
		rootBlockClientId,
		parentAttributes,
	} = props;

	const { text, url, linkTarget, rel } = attributes;

	// TODO: handle with effect
	const menuItemHasChildrens = hasDescendants;

	const linkProps = {
		...( linkTarget && { target: linkTarget } ),
		...( rel && { rel } ),
	};

	// the menu item ref
	const menuItemRef = useRef< HTMLDivElement | null >( null );
	const dropdownRef = useRef< HTMLDivElement | null >( null );

	// Enhanced withDispatch function
	const block = () => {
		const newBlock = createBlock( 'core/group', {
			className: 'dropdown-inner',
			layout: { type: 'constrained' },
		} );
		props
			.dispatch( blockEditorStore )
			.insertBlock( newBlock, undefined, props.clientId );
	};

	const [ showDropdown, setShowDropdown ] = useState( false );

	const [ dropdownPosition, setDropdownPosition ]: [ DropDownCoords, any ] =
		useState( {
			left: 0,
			width: 0,
			maxWidth: document.body.clientWidth,
		} );

	function setParentAttributes() {
		setAttributes( {
			parentAttributes: {
				align: parentAttributes.align,
				menusMinWidth: parentAttributes.menusMinWidth,
				menuItemHasChildrens,
			},
		} );
	}

	const addMenuItemDropdown = () => {
		updateInnerBlocks();
		// then open the dropdown
		setShowDropdown( true );
	};

	const updateDropdownPosition = () => {
		const megamenuItem = menuItemRef.current;
		const megamenu = megamenuItem
			?.closest( '[data-block="' + rootBlockClientId + '"]' )
			?.querySelector( '.wp-block-megamenu' );

		const rootBlockNode = megamenu?.ownerDocument.body;

		const blockCoords = megamenu?.getBoundingClientRect();
		const rootCoords = rootBlockNode?.getBoundingClientRect();

		if ( rootCoords && blockCoords ) {
			const maxWidth =
				parentAttributes.dropdownMaxWidth !== 0
					? parentAttributes.dropdownMaxWidth
					: rootCoords.width;

			setDropdownPosition(
				calcNewPosition( rootCoords, blockCoords, maxWidth )
			);
		}
	};

	useEffect( () => {
		if ( isSelected === true ) {
			updateDropdownPosition();
			setParentAttributes();
			setShowDropdown(
				( isSelected === true || isParentOfSelectedBlock === true ) &&
					menuItemHasChildrens
			);
		}
	}, [ isSelected ] );

	useEffect( () => {
		const blockNode: HTMLElement | null = menuItemRef.current;

		if ( blockNode ) {
			blockNode.ownerDocument.defaultView?.addEventListener(
				'resize',
				updateDropdownPosition
			);
		}
	}, [] );

	const blockProps = useBlockProps( );

	return (
		<>
			<div
				className={ classnames( 'wp-block-megamenu-item', {
					'has-children': menuItemHasChildrens,
					'is-opened': showDropdown,
				} ) }
				ref={ menuItemRef }
			>
				<a
					{ ...linkProps }
					className={ 'wp-block-megamenu-item__link' }
					style={ {
						minWidth: parentAttributes.menusMinWidth
							? parentAttributes.menusMinWidth + 'px'
							: 'auto',
						justifyContent: parentAttributes.align
							? parentAttributes.align
							: 'left',
					} }
				>
					<span className={ 'wp-block-megamenu-item__text' }>
						<RichText
							placeholder={ __( 'Add a menu item' ) }
							value={ text }
							onChange={ ( value ) =>
								setAttributes( { text: value } )
							}
							{ ...blockProps }
							onReplace={ onReplace }
							onMerge={ mergeBlocks }
							identifier="content"
							tagName="span"
							withoutInteractiveFormatting
							preserveWhiteSpace
						/>
					</span>
					{ menuItemHasChildrens ? (
						<Icon
							icon={ chevronDown }
							className="wp-block-megamenu-item__toggle"
							aria-hidden="true"
							style={ {
								fill: 'currentColor',
							} }
						/>
					) : null }
				</a>
				<div
					ref={ dropdownRef }
					className={ 'wp-block-megamenu-item__dropdown' }
					style={ {
						left: ( dropdownPosition?.left || 0 ) + 'px',
						width:
							( dropdownPosition?.width ||
								document.body.clientWidth ) + 'px',
						maxWidth:
							( dropdownPosition?.maxWidth ||
								document.body.clientWidth ) + 'px',
					} }
				>
					<InnerBlocks />
				</div>
			</div>
			<Controls
				{ ...props }
				toggleItemDropdown={ addMenuItemDropdown }
				hasDescendants={ menuItemHasChildrens }
			/>
		</>
	);
}

export default compose( [
	withSelect( ( select, ownProps ) => {
		const {
			hasSelectedInnerBlock,
			getBlockCount,
			getBlockParentsByBlockName,
			getBlock,
		} = select( blockEditorStore );
		const { clientId } = ownProps;
		const isParentOfSelectedBlock = hasSelectedInnerBlock( clientId, true );
		const hasDescendants = !! getBlockCount( clientId );
		const rootBlockClientId = getBlockParentsByBlockName(
			clientId,
			'megamenu/menu'
		)[ 0 ];

		const parentBlock = getBlock( rootBlockClientId );
		const parentAttributes = parentBlock.attributes;

		return {
			isParentOfSelectedBlock,
			hasDescendants,
			rootBlockClientId,
			parentAttributes,
		};
	} ),
	withDispatch( ( dispatch, { clientId } ) => {
		return {
			updateInnerBlocks() {
				dispatch( 'core/block-editor' ).replaceInnerBlocks(
					clientId,
					[],
					false
				);
			},
		};
	} ),
] as any )( Edit );
