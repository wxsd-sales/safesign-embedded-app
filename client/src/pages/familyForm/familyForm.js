import React from "react";
import InputForm from "../../components/familyFormComponents/inputform";
import { navigate } from "@reach/router";

class FamilyForm extends React.Component {

  constructor(props) {
    super(props);
    // demo: initalizing state to pre-filled values
    this.state = {
      step: 1, 
      signingUrl: '', 
      loadingSigning: false,
      otherEthSelected: false,
      showFillAlert: false,
      parentName: '',
      parentEmail: 'test@gmail.com',
      currentDate: new Date().toLocaleDateString(),
      fieldsNeedFilling: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.runSigning = this.runSigning.bind(this);
    this.dismissFillAlert = this.dismissFillAlert.bind(this);
    //this.displayName = this.displayName.bind(this);
  }

  // displayName() {
  //   //e.preventDefault();
  //   //let displayName = '';
  //   this.props.embeddedAppSDK.getUser().then((user) => {
  //     this.setState({
  //       parentName: user.displayName
  //     })
  //     console.log("************dispName function*******************")
  //     console.log(this.state.parentName)
  //     console.log(typeof(this.state.parentName))
  //     //console.log(user.displayName);
  //   }).catch((error) => {
  //     console.log("promise error", error);
  //   }) 
  // }




  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    console.log("name inside handle input change", name)
    const value = target.type === 'checkbox' ? target.checked : target.value;
   
    
    this.setState({
      [name]: value
    });
  } 

  async runSigning (event) {
    // get information about unfilled fields to user, if necessary
    console.log("run signing")
    const inputVals = {
      'Employee\'s Name': this.state.parentName,
      'Employee\'s email': this.state.parentEmail,
      'Current Date': this.state.currentDate
    };
    const inputNotFilled = [];
    for (const [key, value] of Object.entries(inputVals)) {
      if (value === '') {
        inputNotFilled.push(key);
      }
    }
    // validate email
    if (!(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(this.state.parentEmail))) { 
      inputNotFilled.push('Employee\'s email');
    }

    if (inputNotFilled.length !== 0) {
      this.setState({showFillAlert: true, fieldsNeedFilling: inputNotFilled});
      return;
    }

    // start login and get signing URL
    this.setState({loadingSigning: true, showFillAlert: false});
    try {
      await this.runLogin();
      fetch('/api/eg001/family',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          // transmit form info to backend
          parentName: this.state.parentName,
          parentEmail: this.state.parentEmail,
          currentdate: this.state.currentDate
        }),
        credentials: 'include'
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Signing input not accepted');
        }
      })
      .then(data => {
        this.setState({signingUrl: data.signingUrl}, () => {
          window.location.href = data.signingUrl;
        });
      })
      .catch(error => {
        console.log(error);
        navigate('/bad/');
      })
    } catch (error) {
      console.log(error);
      navigate('/bad');
    }
  }

  runLogin() {
    const res = fetch('/api/login', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include'
    })
    .catch(err => {
      console.log(err);
      throw new Error('Login failed');
    });
    return res;
  }

  nextPage() {
    const step = this.state.step;
    if (step < 3) {
      this.setState({step: step + 1});
    }
  }

  prevPage() {
    const step = this.state.step;
    if (step > 1) {
      this.setState({step : step - 1});
    }
  }

  dismissFillAlert() {
    this.setState({showFillAlert: false});
  }


  componentDidMount() {
    this.props.embeddedAppSDK.getUser().then((user) => {
      console.log(user)
      this.setState({
        parentName: user.displayName,
        parentEmail: user.email
      })
    })
  }
  
  render() {
    let curForm;
    
    switch (this.state.step) {
      case 1:
        curForm = <InputForm
                handleChange = {this.handleInputChange}
                prevPage = {this.prevPage}
                submitForm = {this.runSigning}
                dismissFillAlert = {this.dismissFillAlert}
                values = {this.state}
                displayName = {this.state.parentName}
                displayEmail = {this.state.parentEmail}
                embeddedAppSDK={this.props.embeddedAppSDK}
                />
        break;
      default:
        curForm = <h1>Impossible! :o</h1>
    }
    return (
      <div className='input-page'>
        <div id='form-header'>NDA review</div>
        {curForm}
      </div>
    )
  }
}

export default FamilyForm;