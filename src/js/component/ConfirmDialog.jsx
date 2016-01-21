import React, { Component, PropTypes }  from 'react';
import classNames                       from 'classnames';

export const ConfirmDialogResult = {
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
        return (
            <div className={ classNames( 'confirm-dialog-wrapper', { 'on-enter' : this.state.onEnter, 'on-leave' : this.state.onLeave, } ) }>
                <div className="confirm-dialog-overlay" onClick={ () => this.close( ConfirmDialogResult.cancel ) }></div>
                <div className="confirm-dialog-content">
                    <div className="confirm-dialog-message">{ this.props.message }</div>
                    <div className="confirm-dialog-buttons">
                        <button type="button" className="confirm-dialog-ok" onClick={ () => this.close( ConfirmDialogResult.ok ) }>Ok</button>
                        <button type="button" className="onfirm-dialog-cancel" onClick={ () => this.close( ConfirmDialogResult.cancel ) }>Cancel</button>    
                    </div>
                </div>
            </div>
        );
    }
}
