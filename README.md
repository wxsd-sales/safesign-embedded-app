## About The Project
SafeSign is a Webex Embedded App powered by DocuSign. This app is created for the employees to securely sign a non-disclosure agreement within the meeting without having to switch to a third party app. This app can also be modified to fit other use cases such as financial aid applications in education, real estate credit checks etc.,   

## Flow Diagram
SafeSign uses ReactJS for the frontend, NodeJS and Express for the backend. This app uses DocuSign SDK to simplify logging in with authentication instead of accessing the eSignature API directly. A MongoDb is set up for storing the meeting participant's information. To integrate it to the Webex meetings, [Embedded Apps SDK](https://developer.webex.com/docs/api/guides/embedded-apps-reference) is used to create different host and participant views.

## Built With
* ReactJS
* NodeJS
* Express
* DocuSign SDK
* Embedded Apps SDK

## Prerequisites
* Create a [docusign developer account](https://go.docusign.com/o/sandbox/?ga=2.70927056.1363819232.1590515244-192278368.1546193875&ECID=20890&elqCampaignId=20890&LS=NA_DEV_BOTH_BetaSite_2020-05&utm_campaign=NA_DEV_BOTH_BetaSite_2020-05&Channel=DDCUS000016968056&cName=DocuSign.com&postActivateUrl=https://developers.docusign.com/) to create an app.
* Create an app and get integration, secret and private keys.
* Create a [Webex developer account](https://developer.webex.com/) and create an [Embedded App](https://developer.webex.com/my-apps/new) by giving a valid domain and a start page URL.



## How to Run the application
**1.** Clone the project
```
git clone https://github.com/wxsd-sales/safesign-embedded-app.git
```

**2.** Install necessary packages
```
npm install
```

**3.** Create the required files
* Follow appsettingsPublic.json template to create appsettings.json inside the config folder. 
* Create a private.key file in the root folder and paste the RSA private key from Docusign App integration.

### Frontend

**4.** Start your react app
```
cd client
npm start
```

### Backend

**5.** Run the server
```
cd server
npm start
```


## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Please contact us at wxsd@external.cisco.com
