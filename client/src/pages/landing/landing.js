import React from "react"
import {Button, Container, Row, Col} from "react-bootstrap"


class LandingPage extends React.Component {

  render() {
    
    const allowOthers = (event) => {
      event.preventDefault();
  
      // const role = edit ? 'owner' : 'guest';
      console.log(this.props.embeddedAppSDK.getUser())
      this.props.embeddedAppSDK.shareApp(`https://c422-73-70-239-210.ngrok.io/nda`);
    };
    return (
      <Container id='homeContainer'>
        <Row>
          <Col>
            <div className='Landing-card'>
              <h1>Welcome to Safe Sign!</h1>
            </div>
            <Button href='/nda/' variant="success">Get started</Button>
            
            <div id='social-worker-link'>
            New User? <a href='https://go.docusign.com/trial/us-goog-trynow/?elqCampaignId=14921&utm_source=google&utm_medium=cpc&utm_campaign=branded_primary&utm_term=docusign&utm_content=domestic_US&gclid=EAIaIQobChMI8uqE95Ln8wIVwRt9Ch1RjAGLEAAYASAAEgIHOPD_BwE' id="med-form-click-here">Sign up here</a>
            </div>
            
            <Button onClick={allowOthers} variant="success">Share URL</Button>
          </Col>
        </Row>
      </Container>
    )
  }
} 

export default LandingPage;