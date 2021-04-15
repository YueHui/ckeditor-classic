
import { Command } from 'ckeditor5/src/core';
import { toArray } from 'ckeditor5/src/utils';
import { FileRepository } from 'ckeditor5/src/upload';
import { findOptimalInsertionPosition } from 'ckeditor5/src/widget';

export default class UploadImageCommand extends Command {

	execute( options ) {
		const editor = this.editor;
		const model = editor.model;
		// const notification = editor.plugins.get( Notification );

		const fileRepository = editor.plugins.get( FileRepository );

		for ( const file of toArray( options.file ) ) {
			upload(editor, fileRepository, file);
		}
	}
}

function upload( editor, fileRepository, file) {
	const loader = fileRepository.createLoader( file );

	if ( !loader ) {
		return;
	}
	// notification.showInfo('上传中,请勿刷新页面')
	loader.upload()
	_insertAudio( editor, { src: '', controls:true }, loader);
}

function _insertAudio( editor, attributes = {}, loader) {
	const model = editor.model;
	const view = editor.editing.view;

	model.change( writer => {
		const audioElement = writer.createElement( 'audio', attributes );
		const insertAtSelection = findOptimalInsertionPosition( model.document.selection, model );
		model.insertContent( audioElement, insertAtSelection,view);

		setTimeout(()=>{
			_showUploadTips(writer, loader, audioElement, editor)
		},0)

	} );
}

function _showUploadTips(writer, loader, audioElement, editor){
	const model = editor.model;
	const view = editor.editing.view;
	let progressBar;
	const viewFigure = editor.editing.mapper.toViewElement( audioElement );
	view.change( writer => {
		progressBar = _createProgressBar( writer );
		writer.insert(writer.createPositionAt(viewFigure, 'end'), progressBar)
	} );
	loader.on( 'change:uploadedPercent', ( evt, name, value ) => {
		view.change( writer => {
			writer.setStyle( 'width', value + '%', progressBar );
		} );
	} );
	loader.on( 'change:uploadResponse', ( evt, name, value ) => {
		model.change(writer=>{
			writer.setAttribute('src', value.default, audioElement)
		})
		view.change( writer => {
			writer.remove(progressBar)
			progressBar = null;
		} );
	} );
}

function _createProgressBar( writer ) {
	const progressBar = writer.createEmptyElement( 'div', { class: 'ck-audio-progress-bar' } );

	return progressBar;
}
