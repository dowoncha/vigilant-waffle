import React, { Component } from 'react';
import logo from './logo.svg';

import './App.css';

import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom'
import ReactTable from 'react-table'

import Menu, {SubMenu, MenuItem } from 'rc-menu'
import 'rc-menu/assets/index.css';

/** Pages */
import DocReviewPage from './pages/DocReviewPage'

/** Components */
import ActionCell from './components/ActionCell'
import DocumentEditor from './components/DocumentEditor'
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

 
const readFile = async(file) => {  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const text = reader.result;

      resolve(text);
    }

    reader.onerror = function(e) {
      reject(e);
      reader.abort();
    }

    reader.readAsText(file);
  })
};
class Api {
  constructor() {
    this.id = 0;
  }

  getAllDocuments = async () => {
    return Object.keys(localStorage)
      .map((key) => JSON.parse(localStorage.getItem(key)));
  }

  getDocument = async (id) => {
    return JSON.parse(localStorage.getItem(`doc-${id}`))
  }

  postDocument = async(file) => {
    const text = await readFile(file);

    const id = ++this.id;

    const document = {
      id,
      name: file.name,
      size: file.size,
      lastModified: file.lastModified,
      status: 'draft',
      text
    };

    localStorage.setItem(`doc-${id}`, JSON.stringify(document));
  }

  patchDocument = async(newDoc) => {
    const oldDoc = await this.getDocument(newDoc.id)
    const updated = { ...oldDoc, ...newDoc};

    console.log(oldDoc, newDoc, updated)

    localStorage.setItem(`doc-${updated.id}`, JSON.stringify(updated));
  }

  actions = {
    submitForReview: (id) => {
      this.patchDocument({ id, status: 'waitingReview'})
    }
  }
}

const apiService = new Api();

class DocumentTable extends Component {
  static defaultProps = {
    documents: [],
    onAction: (actionName, document) => {}
  }

  state = {
    selected: undefined,
    mouse: {
      x: 0,
      y: 0
    },
  }

  wrapperRef = undefined;

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutsideMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutsideMenu)
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutsideMenu = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      alert('You clicked outside of me')
    }
  }

  render() {
    const { documents } = this.props

    const data = documents;

    const columns = [
      {
        Header: 'ID',
        accessor: 'id'
      }, {
        Header: 'Filename',
        accessor: 'name',
        Cell: (props) => <Link to={`/documents/${props.original.id}`}>{props.value}</Link>
      }, {
        Header: 'Last Modified',
        accessor: 'lastModified'
      }, {
        Header: 'Size',
        accessor: 'size'
      }, {
        Header: 'Status',
        accessor: 'status'
      }, {
        Header: 'Action',
        Cell: this.renderAction
      }
    ];

    return (
      <>
        <ReactTable 
          data={data}
          columns={columns}
          defaultPageSize={5}
          getTrProps={(state, rowInfo) => {
            /**
             * Check if row is selected
             */
            if (rowInfo && rowInfo.row) {
              return {
                onClick: (e) => {
                  this.setState({ selected: rowInfo.index })
                },
                onContextMenu: (e) => {
                  e.preventDefault();

                  console.log(e.screenX, e.screenY)
                        
                  this.setState({ 
                    selected: rowInfo.index,
                    mouse: {
                      x: e.screenX,
                      y: e.screenY - 100,
                    }
                  })
                },
                style: {
                  background: rowInfo.index === this.state.selected ? '#00afec' : 'white',
                  color: rowInfo.index === this.state.selected ? 'white' : 'black'
                }
              }
            } else {
              return {}
            }
          }}
        /> 
        <Menu
          style={{
            position: 'fixed',
            zIndex: 100,
            top: this.state.mouse.y,
            left: this.state.mouse.x,
            backgroundColor: 'white'
          }}
          >

          <MenuItem>Action 1</MenuItem>
          <MenuItem>Action 2</MenuItem>
          <MenuItem>Action 3</MenuItem>
        </Menu>
      </>
    );
  }
}



class SupervisorDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFile: undefined,
      documents: []
    };
  }

  componentDidMount = async() => {
    // Get documents
    await this.getDocuments();
  }

  getDocuments = async() => {
    try {
      const documents = await apiService.getAllDocuments();

      this.setState({ documents })
    } catch (e) {}
  }

  handleFileUpload = async (event) => {
    const file = event.target.files[0]

    this.setState({ uploadedFile: file })

    this.getDocuments();
  }

  handleSubmit = async(e) => {
    e.preventDefault();
    await apiService.postDocument(this.state.uploadedFile);

    await this.getDocuments();
  }

  handleAction = async(actionName, document) => {
    switch (actionName) {
      case 'submitReview':
        console.info(`Submitting document ${document.id} for review`)
        await apiService.actions.submitForReview(document.id)
      break;
      default:
        console.error("Unrecognized Action");
    }
  }

  render() {
    const { documents } = this.state

    return (
      <div className="container-fluid">
        <h1>Supervisor Dashboard</h1>
        <form onSubmit={this.handleSubmit}>
          <label>New Document</label>
          <input
            name="uploaded"
            type="file" 
            onChange={this.handleFileUpload}
          />
          <button type="submit">Save</button>
        </form>
        <DocumentTable 
          documents={documents} 
          onAction={this.handleAction}
        />
      </div>
    )
  }
}

class ReviewerDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      documents: []
    };
  }

  componentDidMount = async () => {
    await this.getDocuments();
  }

  getDocuments = async() => {
    try {
      const documents = await apiService.getAllDocuments();

      this.setState({ documents })
    } catch (e) {}
  }

  handleAction = async(action, document) => {

  }

  render() {
    const { documents } = this.state

    return (
      <div>
        <h1>Reviewer Dashboard</h1>
        <DocumentTable 
          documents={documents}
          onAction={this.handleAction}
        />
      </div>
    )
  }
}

// /welcome -> [Reviewer, Employee, Supervisor, Admin]

class App extends Component {
  render() {
    return (
      <>
        <ErrorBoundary>
          <Router>
            <div>
              <header>
                <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                  <span className="navbar-brand h1">Diff It Up</span>
                </nav>
              </header>
              <Switch>
                <Route path="/" exact render={() => <Redirect to="/supervisor" />} />
                <Route path="/supervisor" component={SupervisorDashboard} />
                <Route path="/reviewer" component={ReviewerDashboard} />
                <Route path="/documents/:id" component={DocReviewPage} />
              </Switch>
            </div>
          </Router>
        </ErrorBoundary>
      </>
    );
  }
}

export default App;
