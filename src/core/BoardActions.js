import { Action }   from 'airflux';

/* Board Actions */

export const setIsDrawing   : Action = new Action().asFunction;
export const zoomOut        : Action = new Action().asFunction;
export const zoomIn         : Action = new Action().asFunction;
export const updateSize     : Action = new Action().asFunction;
export const addWidgetClone : Action = new Action().asFunction; // FIXME

/* Board Store Actions */

export const addWidget      : Action = new Action().asFunction;
export const removeWidget   : Action = new Action().asFunction;
export const setSize        : Action = new Action().asFunction;
export const clearBoard     : Action = new Action().asFunction;
export const setZoom        : Action = new Action().asFunction;

export const addWidgetPanel : Action = new Action().asFunction;
export const removeWidgetPanel : Action = new Action().asFunction;
export const updatePosition : Action = new Action().asFunction;
