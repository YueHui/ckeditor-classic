import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import copyIcon from './copy.svg'
import cutIcon from './cut.svg'
import deleteIcon from './delete.svg'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import delectContent from '@ckeditor/ckeditor5-engine/src/model/utils/deletecontent'

export default class ClipBoardTool extends Plugin{
    init(){
        const editor = this.editor;
        const addButton = _addButton.bind(editor.ui.componentFactory);

        addButton('copy','复制',copyIcon)
        addButton('cut','剪切',cutIcon)
        addButton('delete','删除',deleteIcon)
        
    }
}

function _addButton(type, label, icon){
    this.add( type, locale => {
        const view = new ButtonView( locale );

        view.set( {
            label: label,
            icon: icon,
            tooltip: true
        } );

        // Callback executed once the image is clicked.
        view.on( 'execute', () => {
            const model = this.editor.model;
            const document = model.document;
            const block = Array.from(document.selection.getSelectedBlocks())
            
            model.change( writer => {
                writer.setSelection( block[0], 'on' );
                if(type === 'delete'){
                    delectContent(model, document.selection)
                    return;
                }
                window.document.execCommand( type )
            } );
        } );

        return view;
    } );
}