import React                    from 'react';

import AbstractWidgetView       from '../abstract/View';

import Styles from './View.scss';


export default class JiraWidgetView extends AbstractWidgetView {

    renderView() {

/*
        var req = new XMLHttpRequest();
        req.open('GET', 'https://testwhiteboard.atlassian.net/rest/api/2/issue/WHIT-9', false);
        req.setRequestHeader("admin", "admin");
        req.send(null);
        if(req.status == 200)
          dump(req.responseText);
*/
        return (
            <div className={ Styles.root }>
                { this.props.adresse && this.props.adresse.serv ?
                    <iframe src={ `https://${this.props.adresse.serv }` } width={ this.props.size.width + 30 }
                            height={ this.props.size.height + 65 }></iframe>
                    :
                    <div>Please click on the edit button and enter the URL of a jira link.</div>
                }
            </div>
        );
    }
}
