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
            <>
                {this.props.children}
            </>
        )
    }
}

export default ErrorBoundary