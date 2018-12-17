import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Stylesheets
 */
import 'uikit/dist/css/uikit.min.css'
import './index.css';

/**
 * 3rd party libraries
 */
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'

import App from './App';
import * as serviceWorker from './serviceWorker';

UIkit.use(Icons);

/**
 * Hash function is necessary to run text comparison before diffing
 */
String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
