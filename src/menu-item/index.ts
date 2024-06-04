import { registerBlockType } from '@wordpress/blocks';

import blockMeta from './block.json';
import save from './save';
import edit from './edit';
import { CHILDREN_ICON } from '../utils/icons';
import './style.scss';

registerBlockType( blockMeta.name, {
	icon: CHILDREN_ICON,
	edit,
	save,
} );
