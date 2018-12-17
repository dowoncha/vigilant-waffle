import React from 'react'

const DocumentsContext = React.createContext();

class DocumentsProvider extends React.Component {
    state = {
        documents: []
    }

    componentDidMount() {
    }

    render() {
        return (
            <DocumentsContext.Provider
                value={{
                    ...this.state,
                }}
            >
                {this.props.children}
            </DocumentsContext.Provider>
        );
    }
}