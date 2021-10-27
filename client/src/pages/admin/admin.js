import React from "react"
import { FormControl, InputGroup, Button, Container, Table, Accordion, Badge, Spinner, Row, Col } from "react-bootstrap";

class AdminPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      patientName: '',
      resultsDisplay: '',
      passwordInput: '',
      loadingSearch: false,
      loadingSearchAll: false,
      authenticated: false,
      showFailLogin: false
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.triggerSearch = this.triggerSearch.bind(this);
    this.triggerSearchAll = this.triggerSearchAll.bind(this);
    this.fetchAidInfo = this.fetchAidInfo.bind(this);
    this.renderResults = this.renderResults.bind(this);
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
    this.setState({
      [target.name]: target.value
    });
  }

  triggerSearch(event) {
    event.preventDefault();
    this.setState({loadingSearch: true})
    this.fetchAidInfo(true);
  }

  triggerSearchAll(event) {
    event.preventDefault();
    this.setState({loadingSearchAll: true})
    this.fetchAidInfo(false);
  }

  fetchAidInfo(searchSingle) {
    try {
      fetch('/api/queryAidInfo', 
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          childName: this.state.patientName,
          searchSingle: searchSingle
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
        this.renderResults(data);
        this.setState({loadingSearch: false, loadingSearchAll: false})
      })
      .catch(error => {
        console.log(error);
      })
    } catch (error) {
      console.log(error);
    }
  }

  renderResults(medFamilyInfo) {
    const allNames = []

    // all information in name, table pairs
    const nameTableFamilyInfo = medFamilyInfo.familyInfoResults.map(this.patientDocumentToTable);
    allNames.push(...nameTableFamilyInfo);

    const nameTableMedicalInfo = medFamilyInfo.medInfoResults.map(this.patientDocumentToTable);
    allNames.push(...nameTableMedicalInfo);

    const visitedNames = [];
    let display;
    if (allNames.length !== 0) {
      display = (
        <Accordion defaultActiveKey="0">
          {
            allNames.map((nameTablePair, idx) => {
              // data:
              // nameTablePair.group
              // nameTablePair.patientName
              let name = nameTablePair.patientName;
  
              // don't double count names in both forms
              if (!visitedNames.includes(name)) {
                visitedNames.push(name);
                let familyBadge = <Badge pill bg="danger">Family application unfilled</Badge>
                , socialBadge = <Badge pill bg="danger">Medical form unfilled</Badge>
                , familyInfo = <span></span>
                , socialInfo = <span></span>
                , familyInput = false
                , medicalInput = false;
  
                if (nameTableFamilyInfo.map(elem => elem.patientName).includes(name)) {
                  // family filled form
                  familyInput = true;
                  familyBadge = <Badge pill bg="success">Family application filled</Badge>;
                  familyInfo = nameTableFamilyInfo.find(elem => elem.patientName === name).group;
                }
                if (nameTableMedicalInfo.map(elem => elem.patientName).includes(name)) {
                  // social worker filled form
                  medicalInput = true;
                  socialBadge = <Badge pill bg="success">Medical form filled</Badge>
                  socialInfo = nameTableMedicalInfo.find(elem => elem.patientName === name).group;
                }
  
  
                return (
                  <Accordion.Item key={idx} eventKey={idx}>
                    <Accordion.Header>
                      <b>{nameTablePair.patientName}</b>&nbsp;
                      {familyBadge}&nbsp;
                      {socialBadge}
                    </Accordion.Header>
                    <Accordion.Body>
                      {familyInput ? <h3>Family application information</h3> : <span></span>}
                      {familyInfo}
                      {medicalInput ? <h3>Medical form information</h3> : <span></span>}
                      {socialInfo}
                    </Accordion.Body>
                  </Accordion.Item>
                )
              } else {
                return <span></span>;
              }
            })
          }
        </Accordion>
      );
    } else {
      display = <h2>Patient not found! Search is case-sensitive.</h2>
    }
    
    this.setState({resultsDisplay: display});
  }

  /**
   * Maps patient information to a two column Table, and gets patient name for belonging group
   * 
   * @param {object} doc The document containing all patient information in the form of json
   * @return {object} The Table and corresponding patient name
   */
  patientDocumentToTable(doc) {
    let patientName;
    return {
      group: (
        <Table>
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
          {
            Object.keys(doc).map((key, idx) => {
              if (key === 'childName') {
                patientName = doc[key];
              }
              if (key !== '_id') {
                return (
                  <tr key={idx}>
                    <td>{key}</td>
                    <td>{doc[key]}</td>
                  </tr>
                );
              } else {
                return <span></span>
              }
            })
          }
          </tbody>
        </Table>
      ),
      patientName: patientName
    };
    
  }

  render() {
    let buttonDisp
      , searchAllDisp;
    if (this.state.loadingSearch) {
      buttonDisp = (<Spinner animation="border" role="status" variant="light">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>);
    } else {
      buttonDisp = 'Search';
    }
    if (this.state.loadingSearchAll) {
      searchAllDisp = (<Spinner animation="border" role="status" variant="light">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>);
    } else {
      searchAllDisp = 'Display all patients'
    }
    if (this.state.authenticated) {
      return  (
        <Container id="">
          <div id='form-header'>Search Patients</div>
          <InputGroup size="lg" >
            <InputGroup.Text id="inputGroup-sizing-lg">Patient Name</InputGroup.Text>
            <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" value={this.state.patientName} onChange={this.handleInputChange} name="patientName"/>
          </InputGroup>
          <Button variant="secondary" onClick={this.triggerSearchAll} className="form-button">{searchAllDisp}</Button>
          <Button variant="success" onClick={this.triggerSearch} className="form-button">{buttonDisp}</Button>
          {this.state.resultsDisplay}
        </Container>
      )
    } else {
      // demo: admin password as 1234 with placeholder
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