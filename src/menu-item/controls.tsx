import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Popover,
	TextControl,
	ToggleControl,
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { escapeHtml } from '../utils';

const NEW_TAB_REL = 'noreferrer noopener';

function Controls( props ) {
	const { attributes, setAttributes, toggleItemDropdown, hasDescendants } =
		props;

	const { linkTarget, rel, text, url } = attributes;
	const [ isURLPickerOpen, setIsURLPickerOpen ] = useState( false );

	const isURLSet = ! ( url === undefined || url.trim().length === 0 );

	const openLinkControl = () => {
		setIsURLPickerOpen( true );
		return false;
	};
	const unlinkItem = () => {
		setAttributes( {
			url: undefined,
			linkTarget: undefined,
			rel: undefined,
		} );
		setIsURLPickerOpen( false );
	};

	const onToggleOpenInNewTab = useCallback(
		( value: boolean ) => {
			const newLinkTarget = value ? '_blank' : undefined;

			let updatedRel = rel;
			if ( newLinkTarget && ! rel ) {
				updatedRel = NEW_TAB_REL;
			} else if ( ! newLinkTarget && rel === NEW_TAB_REL ) {
				updatedRel = undefined;
			}

			setAttributes( {
				linkTarget: newLinkTarget,
				rel: updatedRel,
			} );
		},
		[ rel, setAttributes ]
	);

	const onSetLinkRel = useCallback(
		( value: string ) => {
			setAttributes( { rel: value } );
		},
		[ setAttributes ]
	);

	return (
		<>
			<BlockControls>
				<Toolbar label="Options">
					<ToolbarButton
						icon="admin-links"
						title={ __( 'Edit Link' ) }
						onClick={ openLinkControl }
						isActive={ isURLSet }
					/>
					<ToolbarButton
						icon="editor-unlink"
						title={ __( 'Unlink' ) }
						onClick={ unlinkItem }
						isDisabled={ ! isURLSet }
					/>
					{ ! hasDescendants && (
						<ToolbarGroup>
							<ToolbarButton
								icon={ 'download' }
								className={ hasDescendants ? 'is-active' : '' }
								title={ __( 'Add submenu' ) }
								onClick={ toggleItemDropdown }
							/>
						</ToolbarGroup>
					) }
				</Toolbar>
			</BlockControls>
			{ isURLPickerOpen && (
				<Popover
					position="top center"
					onClose={ () => setIsURLPickerOpen( false ) }
				>
					<LinkControl
						value={ {
							url,
							opensInNewTab: linkTarget === '_blank',
						} }
						onChange={ ( {
							title: newTitle = '',
							url: newURL = '',
							opensInNewTab: newOpensInNewTab = false,
							id: newId = '',
							kind: newKind = '',
						} ) => {
							setAttributes( {
								id: newId,
								kind: newKind,
								url: newURL,
								text: ( () => {
									if ( text ) {
										return text;
									}
									if (
										newTitle !== '' &&
										text !== newTitle
									) {
										return escapeHtml( newTitle );
									}
								} )(),
							} );

							if (
								( linkTarget === '_blank' ) !==
								newOpensInNewTab
							) {
								onToggleOpenInNewTab( newOpensInNewTab );
							}

							setIsURLPickerOpen( false );
						} }
					/>
				</Popover>
			) }
			<InspectorControls>
				<PanelBody title={ __( 'Link settings' ) }>
					<ToggleControl
						label={ __( 'Open in new tab' ) }
						onChange={ onToggleOpenInNewTab }
						checked={ linkTarget === '_blank' }
					/>
					<TextControl
						label={ __( 'Link rel' ) }
						value={ rel || '' }
						onChange={ onSetLinkRel }
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}

export default Controls;
