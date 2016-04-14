import React        from 'react';

import * as Widgets from '../widget';


class WidgetFactory {

    getWidgetViewClass( type ) {
        return Widgets[ `${type}View` ];
    }

    getWidgetEditorClass( type ) {
        return Widgets[ `${type}Editor` ];
    }

    createWidgetView( type, props ) {
        return React.createElement( this.getWidgetViewClass( type ), props );
    }

    createWidgetEditor( type, props ) {
        return React.createElement( this.getWidgetEditorClass( type ), props );
    }
}

export default new WidgetFactory();
