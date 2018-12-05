import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
    localStorage.clear();

    localStorage.setItem('documents', JSON.stringify([]));
  }

  getAllDocuments = async () => {
    const documents = JSON.parse(localStorage.getItem('documents'))

    console.log(documents)

    return documents;
  }

  postDocument = async(file) => {
    const text = await readFile(file);

    const document = {
      name: file.name,
      size: file.size,
      lastModified: file.lastModified,
      text
    };

    const documents = JSON.parse(localStorage.getItem('documents')) || [];
    documents.push(document);

    localStorage.setItem('documents', JSON.stringify(documents));
  }
}

const apiService = new Api();

class DocumentTable extends Component {
  static defaultProps = {
    documents: []
  }

  render() {
    const { documents } = this.props

    const documentRows = documents.map((doc) => {
      return (
        <tr key={doc.name}>
          <td>{doc.name}</td>
          <td>{doc.lastModified}</td>
          <td>{doc.size}</td>
          <td>{doc.status}</td>
        </tr>
      );
    })

    return (
      <table>
        <thead>
          <tr>
            <td>Filename</td>
            <td>Last Modified</td>
            <td>Size</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {documentRows}
        </tbody>
      </table>
    );
  }
}

class Document extends Component {
  static defaultProps = {
    diff: []
  }

  render() {
    const { diff } = this.props

    const content = diff.map((part, index) => {
      const color = part.added ? 'green' : part.removed ? 'red' : 'grey'

      const style = { color }

      return <span key={index} style={style}>{part.value}</span>
    })

    return (
      <div>
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

  render() {
    const { documents } = this.state

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>New Document</label>
          <input
            name="uploaded"
            type="file" 
            onChange={this.handleFileUpload}
          />
          <button type="submit">Save</button>
        </form>
        <DocumentTable documents={documents} />
      </div>
    )
  }
}

class ReviewerDashboard extends Component {
  render() {
    return (
      <div>
        <DocumentTable />
      </div>
    )
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <SupervisorDashboard />
        <ReviewerDashboard />
      </div>
    );
  }
}

export default App;
