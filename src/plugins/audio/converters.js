
import { first } from 'ckeditor5/src/utils';
import { getViewAudioFromWidget } from './utils';

/**
 * Returns a function that converts the audio view representation:
 *
 *		<figure class="audio"><audio src="..." alt="..."></audio></figure>
 *
 * to the model representation:
 *
 *		<audio src="..." alt="..."></audio>
 *
 * The entire content of the `<figure>` element except the first `<audio>` is being converted as children
 * of the `<audio>` model element.
 *
 * @returns {Function}
 */
export function viewFigureToModel() {
	return dispatcher => {
		dispatcher.on( 'element:figure', converter );
	};

	function converter( evt, data, conversionApi ) {
		// Do not convert if this is not an "audio figure".
		if ( !conversionApi.consumable.test( data.viewItem, { name: true, classes: 'audio' } ) ) {
			return;
		}

		// Find an audio element inside the figure element.
		const viewAudio = getViewAudioFromWidget( data.viewItem );

		// Do not convert if audio element is absent, is missing src attribute or was already converted.
		if ( !viewAudio || !viewAudio.hasAttribute( 'src' ) || !conversionApi.consumable.test( viewAudio, { name: true } ) ) {
			return;
		}

		// Convert view audio to model audio.
		const conversionResult = conversionApi.convertItem( viewAudio, data.modelCursor );

		// Get audio element from conversion result.
		const modelAudio = first( conversionResult.modelRange.getItems() );

		// When audio wasn't successfully converted then finish conversion.
		if ( !modelAudio ) {
			return;
		}

		// Convert rest of the figure element's children as an audio children.
		conversionApi.convertChildren( data.viewItem, modelAudio );

		conversionApi.updateConversionResult( modelAudio, data );
	}
}

/**
 * Converter used to convert the `srcset` model audio attribute to the `srcset`, `sizes` and `width` attributes in the view.
 *
 * @returns {Function}
 */
export function srcsetAttributeConverter() {
	return dispatcher => {
		dispatcher.on( 'attribute:srcset:audio', converter );
	};

	function converter( evt, data, conversionApi ) {
		if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
			return;
		}

		const writer = conversionApi.writer;
		const figure = conversionApi.mapper.toViewElement( data.item );
		const audio = getViewAudioFromWidget( figure );

		if ( data.attributeNewValue === null ) {
			const srcset = data.attributeOldValue;

			if ( srcset.data ) {
				writer.removeAttribute( 'srcset', audio );
				writer.removeAttribute( 'sizes', audio );

				if ( srcset.width ) {
					writer.removeAttribute( 'width', audio );
				}
			}
		} else {
			const srcset = data.attributeNewValue;

			if ( srcset.data ) {
				writer.setAttribute( 'srcset', srcset.data, audio );
				// Always outputting `100vw`. See https://github.com/ckeditor/ckeditor5-audio/issues/2.
				writer.setAttribute( 'sizes', '100vw', audio );

				if ( srcset.width ) {
					writer.setAttribute( 'width', srcset.width, audio );
				}
			}
		}
	}
}

export function modelToViewAttributeConverter( attributeKey ) {
	return dispatcher => {
		dispatcher.on( `attribute:${ attributeKey }:audio`, converter );
	};

	function converter( evt, data, conversionApi ) {
		if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
			return;
		}

		const viewWriter = conversionApi.writer;
		const figure = conversionApi.mapper.toViewElement( data.item );
		const audio = getViewAudioFromWidget( figure );

		viewWriter.setAttribute( data.attributeKey, data.attributeNewValue || '', audio );
	}
}
