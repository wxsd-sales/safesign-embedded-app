/**
 * Runs embedded signing on a single document.
 *
 * Document should have at least one signer. Offers capability for multiple signers,
 * pre-filled tabs of type text and checkbox.
 * @author DocuSign.
 */

const path = require('path')
    , fs = require('fs-extra')
    , docusign = require('docusign-esign')
    , dsConfig = require('../config/index.js').config
    ;

const eg001EmbeddedSigning = exports
    , eg = 'eg001' // This example reference.
    , minimumBufferMin = 3
    , signerClientId = 1000 // The id of the signer within this application.
    , demoDocsPath = path.resolve(__dirname)
    , dsReturnUrl = dsConfig.appUrl + '/signingDone/'
    , dsPingUrl = dsConfig.appUrl + '/' // Url that will be pinged by the DocuSign signing via Ajax
    ;

/**
 * Create the envelope, the embedded signing, and then redirect to the DocuSign signing
 * @param {object} req Request obj
 * @param {object} res Response obj
 * @param {String} docPath Relative path of document
 * @param {String} displayName Display name of document
 * @param {object} prefillVals All information field values to prefill
 * @param {object} dsTabs All DocuSign tags to display on the document, positioned correctly
 * @param {object} recipients All signer, carbon copy, etc. information
 * @throws {Error} if signing cannot happen with given arguments
 */
eg001EmbeddedSigning.createController = async (req, res, docPath, displayName, prefillVals, dsTabs, recipients) => {
    // Check the token
    let tokenOK = req.dsAuth.checkToken(minimumBufferMin);
    if (!tokenOK) {
        // Save the current operation so it will be resumed after authentication
        req.dsAuth.setEg(req, eg);
        res.json({ errorOccurred: true });
    } else {
        // Call the worker method
        let body = req.body
            , args = {
                accessToken: req.user.accessToken,
                basePath: req.session.basePath,
                accountId: req.session.accountId,
                docInfo: {
                    envelopeArgs: prefillVals,
                    docPath: docPath,
                    docName: displayName,
                    docTabs: dsTabs,
                    docRecipients: recipients
                },
                signerClientId: signerClientId,
                dsReturnUrl: dsReturnUrl,
                dsPingUrl: dsPingUrl
            }
            , results = null;

        results = await eg001EmbeddedSigning.worker(args)

        if (results) {
            // Redirect the user to the embedded signing
            res.json({ signingUrl: results.redirectUrl, errorOccurred: false });
        }
    }
}


/**
 * This function does the work of creating the envelope and the
 * embedded signing
 * @param {object} args
 */
eg001EmbeddedSigning.worker = async (args) => {

    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(args.basePath);
    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
    let envelopesApi = new docusign.EnvelopesApi(dsApiClient)
        , results = null;

    // Make the envelope request body
    let envelope = makeEnvelope(args.docInfo, args.signerClientId);
    if (!envelope) {
        throw new Error('Could not find document');
    }

    // call Envelopes::create API method
    // Exceptions will be caught by the calling function
    results = await envelopesApi.createEnvelope(args.accountId, { envelopeDefinition: envelope });

    let envelopeId = results.envelopeId;
    
    console.log(`Envelope was created. EnvelopeId ${envelopeId}`);
    console.log("-------args--------")
    console.log(args);

    // create the recipient view, the embedded signing
    let viewRequest = makeRecipientViewRequest(args);
    // Call the CreateRecipientView API
    results = await envelopesApi.createRecipientView(args.accountId, envelopeId,
        { recipientViewRequest: viewRequest });

    return ({ envelopeId: envelopeId, redirectUrl: results.url })
}
/* --------------------------------------------------------------------------------------- */
// eg003ListEnvelopes.worker = async (args) => {
    
//     let dsApiClient = new docusign.ApiClient();
//     dsApiClient.setBasePath(args.basePath);
//     dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
//     let envelopesApi = new docusign.EnvelopesApi(dsApiClient)
//       , results = null;

//     // List the envelopes
//     // The Envelopes::listStatusChanges method has many options
//     // See https://developers.docusign.com/esign-rest-api/reference/Envelopes/Envelopes/listStatusChanges

//     // The list status changes call requires at least a from_date OR
//     // a set of envelopeIds. Here we filter using a from_date.
//     // Here we set the from_date to filter envelopes for the last month
//     // Use ISO 8601 date format
//     let options = {fromDate: moment().subtract(30, 'days').format()};

//     // Exceptions will be caught by the calling function
//     results = await envelopesApi.listStatusChanges(args.accountId, options);

//     console.log("-------------------------------------------------------------------------------------");
//     console.log("ENVELOPE STATUS CHANGE");
//     console.log(results);
//     return results;
// }


/* --------------------------------------------------------------------------------------- */


/**
 * Creates envelope
 * @function
 * @param {Object} docInfo parameters for the envelope:
 * @param {Number} signerClientId the signer id within this application
 * @returns {Envelope} An envelope definition
 * @private
 */
function makeEnvelope(docInfo, signerClientId) {

    let docPdfBytes;
    // read file from a local directory
    try {
        docPdfBytes = fs.readFileSync(path.resolve(demoDocsPath, docInfo.docPath));
    } catch (error) {
        console.log('bad: ', error);
        return false;
    }

    // create the envelope definition
    let env = new docusign.EnvelopeDefinition();
    env.emailSubject = docInfo.docName;

    // add the documents
    let doc1 = new docusign.Document()
        , doc1b64 = Buffer.from(docPdfBytes).toString('base64')
        ;

    doc1.documentBase64 = doc1b64;
    doc1.name = docInfo.docName; // can be different from actual file name
    doc1.fileExtension = 'pdf';
    doc1.documentId = '3';

    // The order in the docs array determines the order in the envelope
    env.documents = [doc1];

    // Create a signer recipient to sign the document, identified by name and email
    const signers = [];
    docInfo.docRecipients.signers.forEach(signer => {
        signers.push(
            docusign.Signer.constructFromObject({
                email: signer.email,
                name: signer.name,
                clientUserId: signerClientId,
                recipientId: 1
            })
        );
    });
    if (signers.length === 0) {
        throw new Error('Must have at least one signer.');
    }
    let signer1 = signers[0];

    const tabs = docInfo.docTabs;
    // Tabs are set per recipient / signer
    let signer1Tabs = docusign.Tabs.constructFromObject({
        signHereTabs: tabs.signHereTabs,
        dateSignedTabs: tabs.dateSignedTabs,
        checkboxTabs: tabs.checkboxTabs,
        textTabs: tabs.textTabs
    });
    signer1.tabs = signer1Tabs;

    // Add the recipient to the envelope object
    let recipients = docusign.Recipients.constructFromObject({
        signers: [signer1]
    });
    env.recipients = recipients;

    // Request that the envelope be sent by setting |status| to "sent".
    // To request that the envelope be created as a draft, set to "created"
    env.status = 'sent';

    return env;
}

function makeRecipientViewRequest(args) {
    // Data for this method
    // args.dsReturnUrl
    // args.signerEmail
    // args.signerName
    // args.signerClientId
    // args.dsPingUrl

    let viewRequest = new docusign.RecipientViewRequest();

    // Set the url where you want the recipient to go once they are done signing
    // should typically be a callback route somewhere in your app.
    // The query parameter is included as an example of how
    // to save/recover state information during the redirect to
    // the DocuSign signing. It's usually better to use
    // the session mechanism of your web framework. Query parameters
    // can be changed/spoofed very easily.
    console.log("Recipient View")
    console.log(args.dsReturnUrl)
    viewRequest.returnUrl = args.dsReturnUrl; // + "?state=123";

    // How has your app authenticated the user? In addition to your app's
    // authentication, you can include authenticate steps from DocuSign.
    // Eg, SMS authentication
    viewRequest.authenticationMethod = 'none';

    // Recipient information must match embedded recipient info
    // we used to create the envelope.
    viewRequest.email = args.docInfo.docRecipients.signers[0].email;
    viewRequest.userName = args.docInfo.docRecipients.signers[0].name;
    viewRequest.clientUserId = args.signerClientId;

    

    // DocuSign recommends that you redirect to DocuSign for the
    // embedded signing. There are multiple ways to save state.
    // To maintain your application's session, use the pingUrl
    // parameter. It causes the DocuSign signing web page
    // (not the DocuSign server) to send pings via AJAX to your
    // app,
    // viewRequest.pingFrequency = 600; // seconds
    // // NOTE: The pings will only be sent if the pingUrl is an https address
    // viewRequest.pingUrl = args.dsPingUrl; // optional setting

    return viewRequest
}