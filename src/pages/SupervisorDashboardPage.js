import React, { Component } from 'react'

import DocumentService from '../domain/services/DocumentService'
import DocumentStore from '../store/DocumentStore'

/**
 * Components
 */
import DocumentTable from '../components/DocumentTable'

class SupervisorDashboardPage extends Component {
  state = {
      uploadedFile: undefined,
      documents: []
  }

  documentStore$ = undefined;

  componentDidMount() {
    this.documentStore$ = DocumentStore.subscribe((documentState) => {
      console.log('documentState', documentState)

      this.setState({ documents: documentState })
    })
  }

  componentWillUnmount() {
    if (this.documentStore$) {
      this.documentStore$.unsubscribe();
    }
  }

  handleFileUpload = async (event) => {
    const file = event.target.files[0]

    this.setState({ uploadedFile: file })
  }

  handleSubmit = async(e) => {
    e.preventDefault();

    const { name, size, lastModified } = this.state.uploadedFile

    const doc = {
      name,
      size,
      lastModified
    };

    // Validation

    // Create a new Document
    const document = DocumentService.createDocument(doc)

    console.log(document)

    DocumentStore.addDocument(document);
  }

  handleAction = async(actionName, document) => {
    switch (actionName) {
      case 'submitReview':
        console.info(`Submitting document ${document.id} for review`)
        // await DocumentModel.actions.submitForReview(document.id)
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

export default SupervisorDashboardPage