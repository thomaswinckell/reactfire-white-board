import './index.html';

import React        from 'react';
import ReactDOM     from 'react-dom';

import Board        from '../src';


ReactDOM.render( <Board firebaseUrl="YOUR_FIREBASE_URL" gmapsApiKey="YOUR_GMAPS_KEY" />, document.getElementById( 'app-container' ) );
