import React from "react";
import IncomeInformation from "../../components/familyFormComponents/incomeInfo";
import { navigate } from "@reach/router";

class FamilyForm extends React.Component {

  constructor(props) {
    super(props);
    // demo: initalizing state to pre-filled values
    this.state = {
      step: 3, 
      signingUrl: '', 
      loadingSigning: false,
      otherEthSelected: false,
      showFillAlert: false,
      parentName: 'Test name',
      parentEmail: 'test@gmail.com',
      currentDate: new Date().toLocaleDateString(),
      fieldsNeedFilling: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.runSigning = this.runSigning.bind(this);
    this.dismissFillAlert = this.dismissFillAlert.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    // handle option to input other ethnicity
    // if (name === 'childEthnicity' && value === 'Other') {
    //   this.setState({otherEthSelected: true});
    // } else if (this.state.otherEthSelected && name === 'childEthnicity'
    //             && value !== 'Other' && target.className === 'form-select') {
    //   this.setState({otherEthSelected: false});
    // }
    
    this.setState({
      [name]: value
    });
  }

  async runSigning (event) {
    // get information about unfilled fields to user, if necessary
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
  
  render() {
    let curForm;
    switch (this.state.step) {
      case 3:
        curForm = <IncomeInformation
                handleChange = {this.handleInputChange}
                prevPage = {this.prevPage}
                submitForm = {this.runSigning}
                dismissFillAlert = {this.dismissFillAlert}
                values = {this.state}
                />
        break;
      default:
        curForm = <h1>Impossible! :o</h1>
    }
    return (
      <div className='input-page'>
        <div id='form-header'>NDA information</div>
        {curForm}
      </div>
    )
  }
}

export default FamilyForm;