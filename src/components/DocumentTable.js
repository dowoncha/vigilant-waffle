import React, { Component } from "react";
import { Link } from 'react-router-dom'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class DocumentTable extends Component {
  static defaultProps = {
    documents: [],
    onAction: (actionName, document) => {}
  }

  state = {
    selected: undefined,
    mouse: {
      x: 0,
      y: 0
    },
  }

  wrapperRef = undefined;

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutsideMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutsideMenu)
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutsideMenu = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      alert('You clicked outside of me')
    }
  }

  render() {
    const { documents } = this.props

    const data = documents;

    const columns = [
      {
        Header: 'ID',
        accessor: 'id'
      }, {
        Header: 'Filename',
        accessor: 'name',
        Cell: (props) => <Link to={`/documents/${props.original.id}`}>{props.value}</Link>
      }, {
        Header: 'Last Modified',
        accessor: 'lastModified'
      }, {
        Header: 'Size',
        accessor: 'size'
      }, {
        Header: 'Status',
        accessor: 'status'
      }, {
        Header: 'Action',
        Cell: this.renderAction
      }
    ];

    return (
      <div>
        <ReactTable 
          data={data}
          columns={columns}
          defaultPageSize={5}
          getTrProps={(state, rowInfo) => {
            /**
             * Check if row is selected
             */
            if (rowInfo && rowInfo.row) {
              return {
                onClick: (e) => {
                  this.setState({ selected: rowInfo.index })
                },
                onContextMenu: (e) => {
                  e.preventDefault();

                  console.log(e.screenX, e.screenY)
                        
                  this.setState({ 
                    selected: rowInfo.index,
                    mouse: {
                      x: e.screenX,
                      y: e.screenY - 100,
                    }
                  })
                },
                style: {
                  background: rowInfo.index === this.state.selected ? '#00afec' : 'white',
                  color: rowInfo.index === this.state.selected ? 'white' : 'black'
                }
              }
            } else {
              return {}
            }
          }}
        /> 
      </div>
    );
  }
}

export default DocumentTable