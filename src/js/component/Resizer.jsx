import React, { Component } from 'react';

import { gridWidth }        from 'config/BoardConfig';


export default class Resizer extends Component {

    static propTypes = {
        valueLink       : React.PropTypes.object.isRequired,
        index           : React.PropTypes.number.isRequired,
        resizerWidth    : React.PropTypes.number,
        minWidth        : React.PropTypes.number,
        minHeight       : React.PropTypes.number,
        canResize       : React.PropTypes.func,
        onResizeStart   : React.PropTypes.func,
        onResizeEnd     : React.PropTypes.func
    };

    static defaultProps = {
        resizerWidth    : 20,
        minWidth        : 50,
        minHeight       : 50,
        canResize       : () => true,
        onResizeStart   : () => true,
        onResizeEnd     : () => true
    };

    constructor( props ) {
        super( props );
        this.state = this.props.valueLink.value;
        this.onResize = ::this.onResize;
        this.onResizeEnd = ::this.onResizeEnd;
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

    onResize( event : SyntheticMouseEvent ) {
        if ( this.isResizingWidth ) {
            this.onResizeWidth( event );
        }
        if ( this.isResizingHeight ) {
            this.onResizeHeight( event );
        }
    }

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

    onResizeEnd( event : SyntheticMouseEvent ) {
        this.isResizingWidth = false;
        this.isResizingHeight = false;

        document.removeEventListener( 'mousemove',  this.onResize    );
        document.removeEventListener( 'mouseup',    this.onResizeEnd );

        this.props.onResizeEnd( event );
    }

    render() {
        const styleResizerWidth = {
            zIndex  : this.props.index,
            left    : this.state.width - this.props.resizerWidth + 20,
            top     : 0 + 20,
            width   : this.props.resizerWidth,
            height  : this.state.height - this.props.resizerWidth
        };

        const styleResizerHeight = {
            zIndex  : this.props.index,
            top     : this.state.height - this.props.resizerWidth + 20,
            left    : 0 + 20,
            height  : this.props.resizerWidth,
            width   : this.state.width - this.props.resizerWidth
        };

        const styleResizer = {
            zIndex  : this.props.index,
            left    : this.state.width - this.props.resizerWidth + 20,
            top     : this.state.height - this.props.resizerWidth + 20,
            width   : this.props.resizerWidth,
            height  : this.props.resizerWidth
        };

        return (
          <div className="resizer-container">
              <div className="resizer resizer-width" style={ styleResizerWidth } onMouseDown={ e => this.onResizeStart( e, true ) }></div>

              <div className="resizer resizer-height" style={ styleResizerHeight } onMouseDown={ e => this.onResizeStart( e, false, true ) }></div>

              <div className="resizer resizer-width resizer-height" style={ styleResizer } onMouseDown={ e => this.onResizeStart( e, true, true) }></div>
          </div>
        );
    }
}
