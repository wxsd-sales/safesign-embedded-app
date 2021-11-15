import React from "react"
const queryString = require('query-string');

class SigningDone extends React.Component {

  constructor(props) {
    super(props);
    console.log("Signing done page")
    console.log(props);
    this.state = {signResult: ''};
  }

  componentDidMount() {
    this.props.embeddedAppSDK.shareApp(`https://6afb-73-70-239-210.ngrok.io/signingDone`);
    this.setState({signResult: queryString.parse(this.props.location.search).event});
  }

  render() {
    let showSignResult;
    switch (this.state.signResult) {
      case 'cancel':
        showSignResult = (
        <div>
          <h1>Signing has been cancelled.</h1> 
          <h3>If unintentional, please resubmit form.</h3>
        </div>
        )
        console.log("sign result: ", this.state.signResult)
        break;
      case 'decline':
        showSignResult = (
          <div>
            <h1>Signing has been declined.</h1> 
            <h3>If unintentional, please resubmit form.</h3>
          </div>
          )
          console.log("sign result: ", this.state.signResult)
        break;
      default:
        showSignResult = <h1>Thank you!</h1>;
        console.log("sign result: ", this.state.signResult)
    }
    return (
      <header className='App-header'>
        {showSignResult}
      </header>
    );
  }
}

export default SigningDone;