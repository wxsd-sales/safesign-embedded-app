import React from 'react';
import {Row, Col, Card, Form, Button, Spinner, Alert, ListGroup} from 'react-bootstrap';

class InputForm extends React.Component {

  constructor(props) {
    console.log("input form");
    console.log(props)
    super(props);
    this.state = {
      showFillAlert: false,
      displayName: ''
    }
    this.back = this.back.bind(this);
    this.submit = this.submit.bind(this);
  }

  back(event) {
    event.preventDefault();
    this.props.prevPage();
  }

  submit(event) {
    event.preventDefault();
    this.props.submitForm();
  }
  
  render() {
    let buttonDisp;

    if (this.props.values.loadingSigning) {
      buttonDisp = (
        <Button variant="success" disabled>
          <Spinner animation="border" role="status" variant="light">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Button>
        );
    } else {
      buttonDisp = (
        <Button variant="success" onClick={this.submit} className='form-button' type="submit">
          Review and eSign
        </Button>
      );
    }
    let fillAlert;
    if (this.props.values.showFillAlert) {
      fillAlert = (
        <Alert variant="danger" onClose={this.props.dismissFillAlert} dismissible>
          <Alert.Heading>Please fill out or fix the following fields:</Alert.Heading>
          <ListGroup variant="flush">
            {this.props.values.fieldsNeedFilling.map((field, idx) => 
              <ListGroup.Item variant="danger" key={idx}>{field}</ListGroup.Item>
            )}
          </ListGroup>
      </Alert>
      )
    }

  
    
    return (
      <Row>
        <Col></Col>
        <Col xs={8}>
          <Card className="input-card">
            <Card.Body>
            <Card.Title></Card.Title>
            <Form>
              <Form.Group as={Col}>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="parentName" value={this.props.displayName}
                 onChange={this.props.handleChange} required/>
              </Form.Group>
            <Form.Group as={Col} >
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="parentEmail" value={this.props.displayEmail} onChange={this.props.handleChange} required/>
            </Form.Group>
            <Form.Group as={Col} >
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" placeholder="Date" name="currentDate" defaultValue={new Date().toLocaleDateString()} onChange={this.props.handleChange} required/>
            </Form.Group>
              {buttonDisp}
            </Form>
            </Card.Body>
          </Card>
          {fillAlert}
        </Col>
        <Col></Col>
      </Row>
    )
  }
}

export default InputForm;