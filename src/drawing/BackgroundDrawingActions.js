import { Action }   from 'airflux';

/* Background Drawing Actions */

export const save                : Action = new Action().asFunction;
export const clear               : Action = new Action().asFunction;
export const enable              : Action = new Action().asFunction;
export const disable             : Action = new Action().asFunction;
export const setTool             : Action = new Action().asFunction;

/* Background Drawing Store Actions */

export const setBackgroundDrawing   : Action = new Action().asFunction;
export const setBackgroundImage     : Action = new Action().asFunction;


export const setColor               : Action = new Action().asFunction;
export const setBackgroundColor     : Action = new Action().asFunction;

export const setLineWidth           : Action = new Action().asFunction;
export const setText                : Action = new Action().asFunction;
export const setBold                : Action = new Action().asFunction;
export const setItalic              : Action = new Action().asFunction;
export const setUnderline           : Action = new Action().asFunction;
export const setStrikeThrough       : Action = new Action().asFunction;
export const endText                : Action = new Action().asFunction;
