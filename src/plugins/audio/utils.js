import { toWidget } from 'ckeditor5/src/widget';

export function toAudioWidget(viewElement, writer, label ) {
	writer.setCustomProperty( 'audio', true, viewElement );

	return toWidget( viewElement, writer, { label: labelCreator } );

	function labelCreator() {
		return label;
	}
}

export function getViewAudioFromWidget( figureView ) {
	const figureChildren = [];

	for ( const figureChild of figureView.getChildren() ) {
		figureChildren.push( figureChild );

		if ( figureChild.is( 'element' ) ) {
			figureChildren.push( ...figureChild.getChildren() );
		}
	}

	return figureChildren.find( viewChild => viewChild.is( 'element', 'audio' ) );
}