class MyUploadAdapter {
    constructor( loader ) {
        this.loader = loader;
        this.isAudio = false;
    }

    upload() {
        return this.loader.file
            .then( file => new Promise( ( resolve, reject ) => {
                if(file.type === 'audio/mpeg'){
                    this.isAudio = true
                }
                this._initRequest();
                this._initListeners( resolve, reject, file );
                this._sendRequest( file );
            } ) );
    }

    abort() {
        if ( this.xhr ) {
            this.xhr.abort();
        }
    }

    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();
        xhr.open( 'POST', this._getServerUrl(), true );
        xhr.responseType = 'json';
    }

    _initListeners( resolve, reject, file ) {

        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${ file.name }.`;

        xhr.addEventListener( 'error', () => reject( genericErrorText ) );
        xhr.addEventListener( 'abort', () => reject() );
        xhr.addEventListener( 'load', () => {
            const response = xhr.response;
            if ( !response || response.error ) {
                return reject( response && response.error ? response.error.message : genericErrorText );
            }

            resolve( {
                default: this.isAudio?response.data.url:this._getShowPath()+response.data.fileKey
            } );
        } );

        if ( xhr.upload ) {
            xhr.upload.addEventListener( 'progress', evt => {
                if ( evt.lengthComputable ) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            } );
        }
    }

    _sendRequest( file ) {
        const data = new FormData();

        data.append("fileUsageType", this.isAudio?31:4);
        data.append("file", file);

        this.xhr.send( data );
    }

    _getServerUrl(){
        if(this.isAudio){
            return '//img.'+(document.domain.indexOf('willclass')>-1||document.domain.indexOf('zhitiku')>-1?'willclass':'huitong')+'.com/api/upload/other/file';
        }
        return '//img.'+(document.domain.indexOf('willclass')>-1||document.domain.indexOf('zhitiku')>-1?'willclass':'huitong')+'.com/api/upload/file';
    }
    
    _getShowPath() {
        return '//img.'+(document.domain.indexOf('willclass')>-1||document.domain.indexOf('zhitiku')>-1?'willclass':'huitong')+'.com/api/show/image?fileKey=';
    }
}

// ...

export default function UploadAdapter( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader );
    };
}