const express = require('express')
, session = require('express-session')  
, cookieParser = require('cookie-parser')
, MemoryStore = require('memorystore')(session) 
, path = require('path')
, DsJwtAuth = require('./DSJwtAuth')
, passport = require('passport')
, DocusignStrategy = require('passport-docusign')
, dsConfig = require('../config/index.js').config
, helmet = require('helmet') 
, moment = require('moment')
, csrf = require('csurf') 
  , eg001 = require('./embeddedSigning')
, documentInformation = require('./documentInformation')
, documents = require('./documentsToSign').documents
, database = require('./database')
, cors = require('cors');



const PORT = process.env.PORT || 3001
  , HOST = process.env.HOST || 'localhost'
  , max_session_min = 180;
let hostUrl = 'http://' + HOST + ':' + PORT;


const app = express()
  .use(helmet())
  .use(express.static(path.join(__dirname, 'public')))
  .use(cookieParser())
  .use(session({
    secret: dsConfig.sessionSecret,
    name: 'ds-launcher-session',
    cookie: { maxAge: max_session_min * 60000 },
    saveUninitialized: true,
    resave: true,
    store: new MemoryStore({
      checkPeriod: 86400000 
    })
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use(express.json())
  .use(((req, res, next) => {
    res.locals.user = req.user;
    res.locals.session = req.session;
    res.locals.hostUrl = hostUrl; // Used by DSAuthCodeGrant#logout
    next()
  }))
  .use((req, res, next) => {
    req.dsAuthJwt = new DsJwtAuth(req);
    req.dsAuth = req.dsAuthJwt;
    next();
  })
  .use(cors());


// const server = require('http').createServer(app);
// const io = require('socket.io')(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// })


// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// handle node api requests
app.post("/api/login", (req, res, next) => {
  req.dsAuthJwt.login(req, res, next);
});

app.post('/api/eg001/family', (req, res, next) => handleFormSubmission(req, res, next, documents.NDA, "user"));

app.post("/api/webhook", (req, res) => {

  // io.on("connection", (socket) => {
  //   socket.emit("webhook-data", req.body.data.envelopeSummary);
  //   socket.on("from-server", (arg) => {
  //     console.log(arg)
  //   });
  // })
  res.status(200)
  res.send(req.body.data.envelopeSummary);
  res.send("webhook received")
  
});

// handles submitting a form and putting data to a database collection
async function handleFormSubmission(req, res, next, docType, collectionName) {
  const docDetails = documentInformation.makeDocDetails(docType, req, res);
  console.log(docDetails.prefillVals)

  await eg001.createController(req, res, docDetails.docPath, docDetails.displayName, docDetails.prefillVals, docDetails.dsTabs, docDetails.recipients)
  .then(() => database.populateAidInfo(docDetails.prefillVals, collectionName))
  .catch(error => {
    res.statusCode = 400;
    next();
  });
}

// handles the status of the form

async function handleSubmissionStatus(req, res, next, collectionName) {
  database.submissionStatus(docDetails.prefillVals, collectionName)
}



app.post('/api/adminLogin', (req, res) => {
  try {
    if (req.body.adminPassword === dsConfig.adminPassword) {
      res.json({loginSuccess: true})
    } else {
      res.json({loginSuccess: false})
    }
  } catch (error) {
    console.log(error);
  }
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

passport.serializeUser(function (user, done) { done(null, user) });
passport.deserializeUser(function (obj, done) { done(null, obj) });
let scope = ["signature"];
let docusignStrategy = new DocusignStrategy({
  production: dsConfig.production,
  clientID: dsConfig.dsClientId,
  scope: scope.join(" "),
  clientSecret: dsConfig.dsClientSecret,
  callbackURL: hostUrl + '/ds/callback',
  state: true // automatic CSRF protection.
},
function _processDsResult(accessToken, refreshToken, params, profile, done) {
  let user = profile;
  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  user.expiresIn = params.expires_in;
  user.tokenExpirationTimestamp = moment().add(user.expiresIn, 's'); // The dateTime when the access token will expire
  return done(null, user);
}
);

if (!dsConfig.allowSilentAuthentication) {
  docusignStrategy.authorizationParams = function (options) {
    return { prompt: 'login' };
  }
}
passport.use(docusignStrategy);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

