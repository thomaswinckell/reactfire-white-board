import React, { Component, PropTypes }  from 'react';

import { gridWidth }                    from 'config/BoardConfig';

import Styles   from './Resizer.scss';


export default class Resizer extends Component {

    static propTypes = {
        valueLink       : PropTypes.object.isRequired,
        index           : PropTypes.number.isRequired,
        resizerWidth    : PropTypes.number,
        minWidth        : PropTypes.number,
        minHeight       : PropTypes.number,
        canResize       : PropTypes.func,
        onResizeStart   : PropTypes.func,
        onResizeEnd     : PropTypes.func
    };

    static defaultProps = {
        resizerWidth    : 40,
        minWidth        : 50,
        minHeight       : 50,
        canResize       : () => true,
        onResizeStart   : () => true,
        onResizeEnd     : () => true
    };

    constructor( props ) {
        super( props );
        this.state = this.props.valueLink.value;
    }

    componentWillReceiveProps( nextProps ) {
        this.setState( nextProps.valueLink.value );
    }

    onResizeStart( event : SyntheticMouseEvent, isResizingWidth : boolean, isResizingHeight : boolean ) {

        if ( !this.props.canResize() ) { return; }

        this.isResizingWidth = isResizingWidth;
        this.isResizingHeight = isResizingHeight;

        this._startPageX = event.pageX;
        this._startPageY = event.pageY;
        this._startWidth = this.state.width;
        this._startHeight = this.state.height;

        document.addEventListener( 'mousemove', this.onResize    );
        document.addEventListener( 'mouseup',   this.onResizeEnd );

        this.props.onResizeStart( event );
    }

    onResize = ( event : SyntheticMouseEvent ) => {
        if ( this.isResizingWidth ) {
            this.onResizeWidth( event );
        }
        if ( this.isResizingHeight ) {
            this.onResizeHeight( event );
        }
    };

    onResizeWidth( event : SyntheticMouseEvent ) {
        let width = this._startWidth + ( event.pageX - this._startPageX );

        width = width > this.props.minWidth ? width : this.props.minWidth;

        if ( Math.abs( this.state.width - width ) >= gridWidth ) {
            width = width - width % gridWidth;
            this.props.valueLink.requestChange( { width, height: this.state.height } );
        }
    }

    onResizeHeight( event : SyntheticMouseEvent ) {
        let height = this._startHeight + ( event.pageY - this._startPageY );

        height = height > this.props.minHeight ? height : this.props.minHeight;

        if ( Math.abs( this.state.height - height ) >= gridWidth ) {
            height = height - height % gridWidth;
            this.props.valueLink.requestChange( { height, width: this.state.width } );
        }
    }

    onResizeEnd = ( event : SyntheticMouseEvent ) => {
        this.isResizingWidth = false;
        this.isResizingHeight = false;

        document.removeEventListener( 'mousemove',  this.onResize    );
        document.removeEventListener( 'mouseup',    this.onResizeEnd );

        this.props.onResizeEnd( event );
    };

    render() {
        const { resizerWidth, index } = this.props;
        const { width, height } = this.state;

        const styleResizerWidth = {
            zIndex  : index,
            left    : width - resizerWidth,
            top     : 0,
            width   : resizerWidth,
            height  : height - resizerWidth
        };

        const styleResizerHeight = {
            zIndex  : index,
            top     : height - resizerWidth,
            left    : 0,
            height  : resizerWidth,
            width   : width - resizerWidth
        };

        const styleResizer = {
            zIndex  : index,
            left    : width - resizerWidth,
            top     : height - resizerWidth,
            width   : resizerWidth,
            height  : resizerWidth
        };

        return (
          <div>
              <div className={ Styles.width } style={ styleResizerWidth } onMouseDown={ e => this.onResizeStart( e, true ) }></div>

              <div className={ Styles.height } style={ styleResizerHeight } onMouseDown={ e => this.onResizeStart( e, false, true ) }></div>

              <div className={ Styles.widthHeight } style={ styleResizer } onMouseDown={ e => this.onResizeStart( e, true, true) }></div>
          </div>
        );
    }
}
