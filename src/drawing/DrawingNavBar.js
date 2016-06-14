'use strict';

import * as DrawingActions              from './BackgroundDrawingActions';
import Pencil                           from './tool/Pencil';
import Rectangle                        from './tool/Rectangle';
import Line                             from './tool/Line';

const setTool = ( tool ) => {
    DrawingActions.setTool( tool );
}

export const drawingElements = [
    { text :'Pencil',      icon: 'brush',                   action:    () => setTool( Pencil ) },
    { text :'Line',        icon: 'line',                    action:    () => setTool( Line ) },
    { text :'Rectangle',   icon: 'check_box_outline_blank', action:    () => setTool( Rectangle ) },
    { text :'Color',       icon: 'colorize',                action:    () => DrawingActions.setColor() },
];
