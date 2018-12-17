class ReviewerDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      documents: []
    };
  }

  componentDidMount = async () => {
    await this.getDocuments();
  }

  getDocuments = async() => {
    try {
      const documents = await apiService.getAllDocuments();

      this.setState({ documents })
    } catch (e) {}
  }

  handleAction = async(action, document) => {

  }

  render() {
    const { documents } = this.state

    return (
      <div>
        <h1>Reviewer Dashboard</h1>
        <DocumentTable 
          documents={documents}
          onAction={this.handleAction}
        />
      </div>
    )
  }
}