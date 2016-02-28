import { Action }   from 'airflux';


export default class WidgetActions {
    setEditMode    : Action = new Action().asFunction;
    setViewMode    : Action = new Action().asFunction;
    deleteWidget   : Action = new Action().asFunction;
    select         : Action = new Action().asFunction;
    unselect       : Action = new Action().asFunction;
}
