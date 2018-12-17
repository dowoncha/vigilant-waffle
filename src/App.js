import React, { Component } from 'react';
import logo from './logo.svg';

import './App.css';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

/** Pages */
import DocReviewPage from './pages/DocReviewPage'
import SupervisorDashboardPage from './pages/SupervisorDashboardPage'

/** Components */
import ErrorBoundary from './components/ErrorBoundary'

/**
 * Document review process
 * 
 * 1. Created/Uploaded -> 
 * 2. Edit -> 
 * 3a. Submit for Review <-> 
 * 3b. Edit (View with Patches) -> 
 * 4. Finalize
 */



// /welcome -> [Reviewer, Employee, Supervisor, Admin]

class Sidebar extends Component {
  render() {
    return (
      <div>

      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Router>
        <ErrorBoundary>
          <div>
            <header></header>
            <div className="uk-flex">
              <Sidebar />
              <Switch>
                <Route path="/" exact render={() => <Redirect to="/supervisor" />} />
                <Route path="/supervisor" component={SupervisorDashboardPage} />
                <Route path="/documents/:id" component={DocReviewPage} />
              </Switch>
            </div>
          </div>
        </ErrorBoundary>
      </Router>
    );
  }
}

export default App;
