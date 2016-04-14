import React, { Component }     from 'react';
import { FluxComponent }        from 'airflux';

import AppConfig                from 'config/AppConfig';
import * as ConfigActions       from 'config/ConfigActions';
import Board                    from 'core/Board';
import AuthStore                from 'core/AuthStore';
import BoardStore               from 'core/BoardStore';
import MainNavBar               from 'core/MainNavBar';
import BackgroundDrawing        from 'drawing/BackgroundDrawing';
import BackgroundDrawingStore   from 'drawing/BackgroundDrawingStore';

import 'theme/main.scss';

@FluxComponent
export default class App extends Component {

    constructor( props ) {
        super( props );
        this.state = {};

        this.connectStore( AuthStore,               'authStore' );
        this.connectStore( BoardStore,              'boardStore' );
        this.connectStore( BackgroundDrawingStore,  'backgroundDrawingStore' );
    }

    componentDidMount() {
        const appConfig = new AppConfig( this.props.firebaseUrl, this.props.gmapsApiKey );
        ConfigActions.loadConfig( appConfig );
    }

    renderLoading() {
        return (
            <span>Loading...</span>
        );
    }

    render() {
        const { currentUser } = this.state.authStore;
        const { widgets } = this.state.boardStore;
        const { backgroundDrawing, backgroundImage } = this.state.backgroundDrawingStore;

        if ( !currentUser ) {
            return this.renderLoading();
        }

        return (
            <div>
                <Board widgets={ widgets } backgroundDrawing={ backgroundDrawing } backgroundImage={ backgroundImage }/>
                <BackgroundDrawing imageContent={ backgroundDrawing } />
                <MainNavBar/>
            </div>

        );
    }
}
