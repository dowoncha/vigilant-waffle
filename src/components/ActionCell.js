import React, { Component } from 'react'

class ActionCell extends Component {
    static defaultProps = {
        onClick: (event) => {},
        display: "Action",
        value: "defaultAction",
        dirty: false,
        dirtyMessage: "This has been contaminated!",
        disabled: false,
        disabledMessage: "YOU SHALL NOT PASS"
    }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  handleClick = async (e) => {
    this.setState({ isLoading: true })

    this.props.onClick(e);

    this.setState({ isLoading: false})
  }

  render() {
    const {
        display,
        dirty,
        dirtyMessage,
        disabled,
        disabledMessage
    } = this.props

    const { isLoading } = this.state

    // 4 States
    // Is it loading? -> Show spinner
    // Is it not available? -> Not Available Pill
    // Was an Optional Status Message passed ->  
    // The action is available
    return (
        dirty
            ? <div>{dirtyMessage}</div>
            : disabled
                ? <div>{disabledMessage}</div>
                : <button 
                    className="btn btn-primary"
                    onClick={this.handleClick}
                    disabled={isLoading}
                    >
                        {isLoading 
                            ? <div color={'#123abc'} /> 
                            : <div>{display}</div>
                        }
                    </button>
    );
  }
}

export default ActionCell