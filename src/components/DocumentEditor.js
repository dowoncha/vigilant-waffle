/**
 * DocumentEditor
 * 
 * Provide editing and versioning functionality to Documents
 * Every edit results in a new version
 * Latest version is the current state and will be present on display
 * CRUD operations for document versions list
 * List of attachments for each doc_id, version
 * Separate table of doc_id, version, comment/suggestions
 * CRUD operations for comments
 * Save for later
 */

import React, { Component } from 'react'

import { Editor } from 'slate-react'
import { Value } from 'slate'
 
// import * as JsDiff from 'diff'
const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        node: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text in a paragraph.'
              }
            ]
          }
        ]
      }
    ]
  }
})

class DocumentEditor extends Component {
  state = {
    value: initialValue
  }

  handleChange = ({ value }) => {
    this.setState({ value })
  }

  render() {
    // console.log(this.state.editorState)
    // console.log(this.state.editorState.getCurrentContent().getEntityMap())

    /*
    blockMap.forEach((block) => {
      console.log(block)
    })
    */

    /*
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
    */

    return (
      <div 
        className='uk-card uk-card-large uk-card-default'
      >
        <div className="uk-card-header">
          <nav className="uk-navbar-container" data-uk-navbar>
            <ul className="uk-iconnav">
            </ul>
          </nav>
        </div>
        <div className="uk-card-body">
          <Editor
            value={this.state.value}
            onChange={this.handleChange}
          />
        </div>

        <div className="uk-card-footer">
        </div>
      </div>
    )
  }
}

const styles = {
  editorRoot: {
  },
  editorContainer: {
    backgroundColor: 'white',
    height: '60vh',
    border: '1px solid #ddd'
  }
};

export default DocumentEditor