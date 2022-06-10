import React from "react"
import { FormControl, InputGroup, Button, Container, Row, Col } from "react-bootstrap";

class AdminPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      employeeName: '',
      resultsDisplay: '',
      passwordInput: '',
      authenticated: false,
      showFailLogin: false
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleLogin(event) {
    try {
      fetch('/api/adminLogin', 
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          adminPassword: this.state.passwordInput
        }),
        credentials: 'include'
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          Promise.reject();
        }
      })
      .then(data => {
        if (data.loginSuccess) {
          this.setState({authenticated: true});
        } else {
          this.setState({showFailLogin: true});
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  handleInputChange(event) {
    const target = event.target;
    console.log(target.value);
    this.setState({
      [target.name]: target.value
    });
  }

  
  render() {
    
    if (this.state.authenticated) {
      return  (
        <Container id="">
          <div id='form-header'>Employee Status</div>
          <InputGroup size="lg" >
            <InputGroup.Text id="inputGroup-sizing-lg">Employee Name</InputGroup.Text>
            <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" value={this.state.employeeName} onChange={this.handleInputChange} name="employeeName"/>
          </InputGroup>
          
          {this.state.resultsDisplay}
        </Container>
      )
    } else {
      //admin password as 1234 with placeholder
      return (
        <Container id="">
          <Row>
            <Col></Col>
            <Col xs={6}>
              <div id='form-header'>Admin Portal</div>
              <InputGroup size="sm" >
                <InputGroup.Text id="inputGroup-sizing-sm">Password</InputGroup.Text>
                <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" value={this.state.passwordInput} onChange={this.handleInputChange} name="passwordInput"
                placeholder="1234 (for demonstration)"/>
              </InputGroup>
              <Button variant="warning" onClick={this.handleLogin} className="form-button">Login</Button>
              {this.state.showFailLogin ? <h4>Incorrect password.</h4> : <span></span>}
            </Col>
          <Col></Col>
          </Row>
        </Container>
      )
    }
    
  }
}

export default AdminPage;