import React, { Component } from 'react';
import logo from './logo.svg';


import './App.css';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import ReactTable from 'react-table'

import * as JsDiff from 'diff'
 
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
      this.patchDocument({ id, status: 'waiting-review'})
    }
  }
}

const apiService = new Api();

class DocumentTable extends Component {
  static defaultProps = {
    documents: [],
    handleAction: (actionName) => {}
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
        Cell: (props) => <Link to={`/${props.original.id}/edit`}>{props.value}</Link>
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
        Cell: (props) => (
          <button 
            name="submitForReview" 
            onClick={(e) => {
              this.props.handleAction(e.target.name, props.original)}}
          >
            Submit for Review
          </button>
        )
      }
    ];

    return (
      <>
        <ReactTable 
          data={data}
          columns={columns}
          defaultPageSize={5}
        />
      </>
    );
  }
}

class DocumentEditor extends Component {
  static defaultProps = {
    originText: '',
  }

  constructor(props) {
    super(props);

    console.log('de')

    this.state = {
      text: '',
      diff: []
    }
  }

  componentDidMount = () => {
    this.setState({ text: this.state.originText })

    const diff = JsDiff.diffChars(this.props.originText, this.state.text);

    console.log(diff);

    this.setState({ diff })
  }

  render() {
    const { diff } = this.state

    const content = diff.map((part, index) => {
      const color = part.added ? 'green' : part.removed ? 'red' : 'grey'

      const style = { color }

      return <span key={index} style={style}>{part.value}</span>
    })

    return (
      <div>
        <h1>Document Editor</h1>
        {content}
      </div>
    )
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
      case 'submitForReview':
        await apiService.actions.submitForReview(document.id)
      break;
      default:
        console.error("Unrecognized Action");
    }
  }

  render() {
    const { documents } = this.state

    return (
      <div>
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
          handleAction={this.handleAction}
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

  render() {
    const { documents } = this.state

    return (
      <div>
        <h1>Reviewer Dashboard</h1>
        <DocumentTable documents={documents}/>
      </div>
    )
  }
}


class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <SupervisorDashboard />
          <ReviewerDashboard />
          <Route link="/:id/edit" component={DocumentEditor} />
        </div>
      </Router>
    );
  }
}

export default App;
