import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classicEditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockToolbar from '@ckeditor/ckeditor5-ui/src/toolbar/block/blocktoolbar';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import Notification from '@ckeditor/ckeditor5-ui/src/notification/notification';
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount'

import Copy from './plugins/clipBoardTool'
import CustomUploadAdapter from './plugins/uploadAdapter'
import Audio from './plugins/audio'

import FindReplace from './plugins/ckeditor5-find-replace/src/findReplace'

import '../theme/theme.css';

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	BlockToolbar,
	Bold,
	Italic,
	Underline,
	Strikethrough,
	BlockQuote,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	ImageResize,
	Indent,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TableCellProperties,
	TableProperties,
	TextTransformation,
	Notification,
	FontColor,
	FontBackgroundColor,
	WordCount,
    Copy,
	CustomUploadAdapter,
	Audio,
	FindReplace
];

// Editor configuration.
ClassicEditor.defaultConfig = {
    heading: {
        options: [
        	{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        	{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        	{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        	{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
        ]
    },
	blockToolbar: ['heading','|','uploadImage','insertTable','mediaEmbed','audio','|','copy','cut','delete'],
	toolbar: {
		items: ['bold','italic','underline', 'strikethrough', 'fontColor','fontBackgroundColor','findReplace']
	},
	image: {
		toolbar: ['imageStyle:full','imageStyle:side','|','imageTextAlternative']
	},
	table: {
		contentToolbar: ['tableColumn','tableRow','mergeTableCells']
	},
	mediaEmbed: {
		providers: [
			{
				name: 'bilibili',
				url: /bilibili\.com\/video\/(\w+)/,
				html: match=>{
					const videoId = match[1]
					return `
						<div style="position: relative; padding-bottom: 100%; height: 0; ">
							<iframe src="//player.bilibili.com/player.html?bvid=${videoId}"
								style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;"
								frameborder="0" allowfullscreen allow="autoplay">
							</iframe>
						</div>
					`
				}
			},
			{
				name: 'youku',
				url: /youku\.com\/v_show\/id_(\S+)\.html/,
				html: match=>{
					const videoId = match[1]
					console.log(videoId);
					return `
						<div style="position: relative; padding-bottom: 100%; height: 0; ">
							<iframe src="https://player.youku.com/embed/${videoId}"
								style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;"
								frameborder="0" allowfullscreen allow="autoplay">
							</iframe>
						</div>
					`
				}
			}
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'zh-cn'
};