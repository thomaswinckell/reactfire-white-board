import React, { Component, PropTypes }  from 'react';
import classNames                       from 'classnames';

import Styles   from './ConfirmDialog.scss';


export const Result = {
    ok      : true,
    cancel  : false
};


export default class ConfirmDialog extends Component {

    static defaultProps = {
        message : 'Are you sure ?',
        onClose : () => true
    }

    constructor( props ) {
        super( props );
        this.state = {
            onEnter : true
        };
    }

    componentWillMount() {
        setTimeout( () => {
            this.setState( { onEnter : false } );
        }, 200 );
    }

    close( result ) {
        this.setState( { onLeave : true }, () => setTimeout( () => {
            this.props.onClose( result );
        }, 500 ) );
    }

    render() {
        const wrapperClassName = classNames( Styles.wrapper, {
            [ Styles.onEnter ] : this.state.onEnter,
            [ Styles.onLeave ] : this.state.onLeave
        } );
        return (
            <div className={ wrapperClassName }>
                <div className={ Styles.overlay } onClick={ () => this.close( Result.cancel ) }></div>
                <div className={ Styles.content }>
                    <div className={ Styles.message }>{ this.props.message }</div>
                    <div className={ Styles.buttons }>
                        <button type="button" onClick={ () => this.close( Result.ok ) }>Ok</button>
                        <button type="button" onClick={ () => this.close( Result.cancel ) }>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}
