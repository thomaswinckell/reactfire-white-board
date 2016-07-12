import './index.html';

import React        from 'react';
import ReactDOM     from 'react-dom';

import Board, {
    Elements
}               from '../src';


/*const umlTypes = [ 'TextWidget', 'TodoListWidget' ];

const umlElements = Elements.filter( e =>  umlTypes.indexOf( e.type ) > -1 );

ReactDOM.render( <Board elements={ umlElements } firebaseUrl="flickering-torch-7474.firebaseio.com" boardKey="-KFPEXh-RGkG5uXtgX4M" gmapsApiKey="AIzaSyBN5nAMeOkCj_fzZs9gw4BPEfsRZAMH5cQ" />, document.getElementById( 'app-container' ) );
*/

ReactDOM.render( <Board firebaseUrl="flickering-torch-7474.firebaseio.com" boardKey="-KFPEXh-RGkG5uXtgX4M" gmapsApiKey="AIzaSyBN5nAMeOkCj_fzZs9gw4BPEfsRZAMH5cQ" />, document.getElementById( 'app-container' ) );
