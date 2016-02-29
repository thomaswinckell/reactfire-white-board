import React, { Component }     from 'react';
import { FluxComponent }        from 'airflux';

import Board                    from 'core/Board';
import BackgroundDrawing        from 'core/BackgroundDrawing';
import MainNavBar               from 'core/MainNavBar';
import AuthStore                from 'core/AuthStore';
import BoardStore               from 'core/BoardStore';
import BackgroundDrawingStore   from 'core/BackgroundDrawingStore';


@FluxComponent
export default class App extends Component {

    constructor( props ) {
        super( props );
        this.state = {};

        this.connectStore( AuthStore,               'authStore' );
        this.connectStore( BoardStore,              'boardStore' );
        this.connectStore( BackgroundDrawingStore,  'backgroundDrawingStore' );
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
                <BackgroundDrawing imageContent={ backgroundDrawing }>
                    <MainNavBar/>
                </BackgroundDrawing>
            </div>

        );
    }
}
