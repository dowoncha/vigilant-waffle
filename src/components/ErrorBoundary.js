import React from 'react'

class ErrorBoundary extends React.Component {
    state = {
        hasError: false
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true })
        console.error(error);
    }

    render() {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        )
    }
}

export default ErrorBoundary