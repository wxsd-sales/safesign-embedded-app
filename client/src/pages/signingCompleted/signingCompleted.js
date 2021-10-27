import React from "react"
const queryString = require('query-string');

class SigningDone extends React.Component {

  constructor(props) {
    super(props);
    this.state = {signResult: ''};
  }

  componentDidMount() {
    this.setState({signResult: queryString.parse(this.props.location.search).event});
  }

  render() {
    let showSignResult;
    console.log("here")
    switch (this.state.signResult) {
      case 'cancel':
        showSignResult = (
        <div>
          <h1>Signing has been cancelled.</h1> 
          <h3>If unintentional, please resubmit form.</h3>
        </div>
        )
        break;
      case 'decline':
        showSignResult = (
          <div>
            <h1>Signing has been declined.</h1> 
            <h3>If unintentional, please resubmit form.</h3>
          </div>
          )
        break;
      default:
        showSignResult = <h1>Thank you!</h1>;
    }
    return (
      <header className='App-header'>
        {showSignResult}
      </header>
    );
  }
}

export default SigningDone;