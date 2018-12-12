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

import Draft, { Editor, EditorState } from 'draft-js'

import 'draft-js/dist/Draft.css'

import * as JsDiff from 'diff'

class DocumentEditor extends Component {
  state = {
    editorState: EditorState.createEmpty()
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
    // console.log(this.state.editorState)
    // console.log(this.state.editorState.getCurrentContent().getEntityMap())
    const blockMap = this.state.editorState.getCurrentContent().getBlockMap();

    console.log(this.state.editorState.getCurrentContent().getFirstBlock())

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
        className="container-fluid"
        style={{
          backgroundColor: '#eee',
          height: '100vh'
        }}>
        <div className={styles.editorRoot}>
          <Editor 
            editorState={this.state.editorState} 
            onChange={this.handleChange}
          />
        </div>
      </div>
    )
  }
}

const styles = {

};

export default DocumentEditor