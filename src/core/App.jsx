import React, { Component }     from 'react';
import { FluxComponent }        from 'airflux';

import AppConfig                from '../config/AppConfig';
import * as ConfigActions       from '../config/ConfigActions';

import en                       from 'react-intl/locale-data/en';
import fr                       from 'react-intl/locale-data/fr';
import frMessages               from '../i18n/locales/fr.json';
import {addLocaleData,
    IntlProvider}               from 'react-intl';

import Board                    from './Board';
import AuthStore                from './AuthStore';
import BoardStore               from './BoardStore';
import MainNavBar               from './MainNavBar';
import BackgroundDrawing        from '../drawing/BackgroundDrawing';
import BackgroundDrawingStore   from '../drawing/BackgroundDrawingStore';
import NotificationStore        from './NotificationStore';
import Notification             from '../component/Notification';
import WidgetsElements          from '../widget/Elements';

addLocaleData( [ ...en, ...fr ] );

function getLocalMessage( locale ) {
    switch ( locale ) {
        case 'fr':
            return frMessages;
        case 'en':
            return;
        default:
            return;
    }
}

@FluxComponent
export default class App extends Component {

    static defaultProps = {
        elements : WidgetsElements,
        locale : 'en'
    };

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
            <IntlProvider locale={ this.props.locale } messages={ getLocalMessage( this.props.locale ) }>
                <div>
                    <Notification notifs={ notifs } />
                    <Board widgets={ widgets } backgroundDrawing={ backgroundDrawing } backgroundImage={ backgroundImage }/>
                    <BackgroundDrawing imageContent={ backgroundDrawing } />
                    <MainNavBar elements={ this.props.elements } />
                </div>
            </IntlProvider>
        );
    }
}
