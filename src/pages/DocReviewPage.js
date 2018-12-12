import React from 'react'

import DocumentEditor from '../components/DocumentEditor'

class DocumentReviewPage extends React.Component {
    componentDidMount = async() => {
        const { id } = this.props.match.params
        const doc = {} // await apiService.getDocument(id);
        
        this.setState({ 
        doc,
        });
    }

    render() {
        return (
            <div>
                <DocumentEditor 
                />
            </div>
        )
    }
}

export default DocumentReviewPage