import React, { Component } from 'react';
import logo from './logo.svg';

import './App.css';

import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom'
import ReactTable from 'react-table'

import * as JsDiff from 'diff'

import Draft, { Editor, EditorState } from 'draft-js'

/** Components */
import ActionCell from './components/ActionCell'

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

  renderAction = (props) => {
    const doc = props.original

    /*
    switch (doc.status) {
      case 'draft':
        return <ActionCell
          display="Submit For Review"
          onClick={(e) => this.props.onAction("submitReview", doc)}
        />
      case 'waitingReview':
        return <ActionCell
          display="Review"
          onClick={(e) => this.props.onAction("review", doc)}
        />
      case 'reviewed':
      default:
        return <div>No Action for State</div>
    }
    */

    return (
      <div>
        <button onClick={(e) => this.props.onAction("edit", doc)}>Edit Original</button>
        <button>Review</button>
        <button>Patches</button>
      </div>
    )
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
        Cell: this.renderAction
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
  content;

  constructor(props) {
    super(props);

    this.state = {
      doc: undefined,
      diff: [],
      editorState: EditorState.createEmpty()
    }
  }

  componentDidMount = async() => {
    const { id } = this.props.match.params
    const doc = await apiService.getDocument(id);
    
    this.setState({ 
      doc,
      editorState: EditorState.createWithContent(Draft.ContentState.createFromText(doc.text))
    });
  }

  handleChange = (editorState) => {
    /*
    const diff = JsDiff.diffWordsWithSpace(this.state.doc.text, editorState.getCurrentContent().getPlainText());

    const contentBlocks = diff.map((part, index) => {
      const color = part.added ? 'green' : part.removed ? 'red' : 'grey'

      const style = { color }

      return new Draft.ContentBlock({
        key: index,
        text: part.value
      });
    })

    const contentState = Draft.ContentState.createFromBlockArray(contentBlocks);

    console.log(editorState.getCurrentContent().getBlockMap())
    console.log(contentState.getBlockMap())
    */

    this.setState({ editorState })
  }

  render() {
    const { doc } = this.state

    const editorText = this.state.editorState.getCurrentContent().getPlainText();

    if (doc && doc.text.hashCode !== editorText) {
      const diff = JsDiff.diffWordsWithSpace(doc.text, editorText)

      this.content = diff.map((part, index) => {
        const color = part.added ? 'green' : part.removed ? 'red' : 'grey'

        const style = { color }

        return (<span key={index} style={style}>{part.value}</span>)
      })
    }

    return (
      <div className="container">
        <h1>Document Editor</h1>
        { doc &&
          <div>
            <p>Filename: {doc.name}</p>
            <div className="row">
              <div className="col">
              <Editor 
                editorState={this.state.editorState} 
                onChange={this.handleChange}
              />
              </div>
              <div className="col">
                {this.content}
              </div>
            </div>
          </div>
        }
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

class App extends Component {
  render() {
    return (
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
            <Route path="/:id/edit" component={DocumentEditor} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
