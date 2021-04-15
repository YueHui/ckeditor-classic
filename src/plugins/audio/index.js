import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import audioIcon from './audio.svg'
import { FileDialogButtonView } from 'ckeditor5/src/upload';
import { FileRepository } from 'ckeditor5/src/upload';
import { Notification } from 'ckeditor5/src/ui';
import UploadImageCommand from './uploadAudioCommand'
import {toAudioWidget} from "./utils";
import {modelToViewAttributeConverter, srcsetAttributeConverter, viewFigureToModel} from "./converters";
import MediaLoadObserver from "./mediaObserver";
import './audio.css'

export default class Audio extends Plugin{

    static get requires() {
		return [ FileRepository, Notification ];
	}

    init(){
        console.log('init audio');
        const editor = this.editor;
        const conversion = editor.conversion;
        const t = editor.t;
        const types = ['.mp3']


        const uploadAudioCommand = new UploadImageCommand(editor);
        editor.commands.add( 'uploadAudio', uploadAudioCommand );
        editor.editing.view.addObserver(MediaLoadObserver);


        editor.model.schema.register( 'audio', {
            allowWhere: '$block',
            isBlock: true,
            isObject:true,
            allowAttributes: [ 'controls', 'src' ]
        } );


        conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'audio',
			view: ( modelElement, { writer } ) => createAudioElement( writer )
		} );

        conversion.for( 'upcast' )
            .elementToElement( {
                view: {
                    name: 'audio',
                    attributes: {
                        src: true,
                        controls: true
                    }
                },
                model: ( viewAudio, { writer } ) => writer.createElement( 'audio', { src: viewAudio.getAttribute( 'src' ), controls: viewAudio.getAttribute('controls') } )
            } )
            .add( viewFigureToModel() );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'audio',
			view: ( modelElement, { writer } ) => toAudioWidget( createAudioElement( writer ), writer, t( 'audio widget' ) )
		} );

		conversion.for( 'downcast' )
			.add( modelToViewAttributeConverter( 'src' ) )
			.add( modelToViewAttributeConverter( 'controls' ) )

        editor.ui.componentFactory.add( 'audio', locale => {
            const view = new FileDialogButtonView( locale );

            view.set({
                acceptedType: types.join( ',' ),
				allowMultipleFiles: false
            })
    
            view.buttonView.set( {
                label: '音频',
                icon: audioIcon,
                tooltip: true
            } );

            view.on( 'done', ( evt, files ) => {
				const audioToUpload = Array.from( files )
				if ( audioToUpload.length ) {
					editor.execute( 'uploadAudio', { file: audioToUpload[0] } );
				}
			} );

            return view;
        })
    }

}

function createAudioElement(writer){
    const audioElement = writer.createEmptyElement( 'audio' );
    const figure = writer.createContainerElement( 'figure', { class: 'audio' } );
    writer.insert( writer.createPositionAt( figure, 0 ), audioElement );

    return figure;
}