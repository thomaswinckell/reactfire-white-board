import React, { Component }     from 'react';
import { FluxComponent }        from 'airflux';

import AppConfig                from '../config/AppConfig';
import * as ConfigActions       from '../config/ConfigActions';
import Board                    from './Board';
import AuthStore                from './AuthStore';
import BoardStore               from './BoardStore';
import MainNavBar               from './MainNavBar';
import BackgroundDrawing        from '../drawing/BackgroundDrawing';
import BackgroundDrawingStore   from '../drawing/BackgroundDrawingStore';
import NotificationStore        from './NotificationStore';
import Notification             from '../component/Notification';

import '../theme/main.scss';

@FluxComponent
export default class App extends Component {

    constructor( props ) {
        super( props );
        this.state = {};

        this.connectStore( AuthStore,               'authStore' );
        this.connectStore( BoardStore,              'boardStore' );
        this.connectStore( BackgroundDrawingStore,  'backgroundDrawingStore' );
        this.connectStore( NotificationStore,       'notificationStore' );
    }

    componentDidMount() {
        const appConfig = new AppConfig( this.props.firebaseUrl, this.props.gmapsApiKey, this.props.boardKey );
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
        const { notifs } = this.state.notificationStore;

        if ( !currentUser ) {
            return this.renderLoading();
        }

        return (
            <div>
                { notifs.length !==0 ? <Notification notifs= { notifs } /> : null }
                <Board widgets={ widgets } backgroundDrawing={ backgroundDrawing } backgroundImage={ backgroundImage }/>
                <BackgroundDrawing imageContent={ backgroundDrawing } />
                <MainNavBar/>
            </div>

        );
    }
}
