import React from 'react'

import DocumentEditor from '../components/DocumentEditor'

class VersionHistory extends React.Component {
    render() {
        return (
            <div>
                <ul className="uk-list">
                </ul>
            </div>
        )
    }
}

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
            <div className="tm-main uk-section uk-section-default">
                <div className="uk-container uk-container-small uk-position-relative">
                    <div>
                        <DocumentEditor 
                        />
                    </div>
                    <div className="tm-sidebar-right">
                        <div className="uk-sticky">
                            <VersionHistory />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DocumentReviewPage