
const documentInformation = exports
      , docusign = require('docusign-esign')
      , documents = require('./documentsToSign').documents;

/**
 * @param {String} anchorString place tab matching this string
 * @param {Number} xOffset x offset from center of string, inches
 * @param {Number} xWidth width of tab in pixels
 * @param {String} value value for this tab to take
selected
 * @returns a DocuSign tab
 */
function makeTextTab(anchorString, xOffset, xWidth, value) {
  return (
      docusign.Text.constructFromObject({
          anchorString: anchorString, anchorUnits: 'inches',
          anchorCaseSensitive: false, 
          anchorYOffset: '-0.12', anchorXOffset: xOffset,
          font: 'helvetica', fontSize: 'size11',
          bold: 'true', value: value,
          locked: 'false', tabId: anchorString,
          tabLabel: anchorString, width:xWidth
      })
  )
}

/**
 * Creates a tab to add to a document, with an x and y offset
 * @param {String} anchorString place tab matching this string
 * @param {Number} xOffset x offset from center of string, inches
 * @param {Number} yOffset offset from center of string, inches
 * @param {Number} xWidth width of tab in pixels
 * @param {String} value value for this tab to take
selected
 * @returns a DocuSign tab
 */
function makeYTextTab(anchorString, xOffset, yOffset, xWidth, value) {
  return (
      docusign.Text.constructFromObject({
          anchorString: anchorString, anchorUnits: 'inches',
          anchorCaseSensitive: false, 
          anchorYOffset: yOffset, anchorXOffset: xOffset,
          font: 'helvetica', fontSize: 'size11',
          bold: 'true', value: value,
          locked: 'false', tabId: anchorString,
          tabLabel: anchorString, width:xWidth
      })
  )
}

/**
 * Makes a pre-filled checkbox on a document
 * @param {String} anchorString place tab to matching this string
 * @param {Number} xOffset x offset from center of string
 * @param {Boolean} checked whether this box should be 
 * @returns a DocuSign tab
 */
 function makeCheckbox(anchorString, xOffset, checked) {
  return (
      docusign.Checkbox.constructFromObject({
          anchorString: anchorString, anchorUnits: 'inches', anchorXOffset: xOffset, anchorYOffset: -0.1,  anchorCaseSensitive: false, locked: false, selected: checked, tabId: anchorString, tabLabel: anchorString
      })
  )
}

documentInformation.makeDocDetails = (doc, req, res) => {
  // extract values from the request
  const body = req.body;

  const prefillVals = {};
  const dsTabs = {};
  const recipients = {};
  let displayName = 'Document';
  switch (doc) {
    case documents.NDA:
      displayName = 'Employee NDA'
  
      prefillVals.parentName = body.parentName;
      prefillVals.parentEmail = body.parentEmail;
      prefillVals.currentDate = new Date().toLocaleDateString();
      prefillVals.submissionStatus = "undefined"

      // document recipients, must have at least name and email
      recipients.signers = [
        {
          name: body.parentName,
          email: body.parentEmail
        }
      ];

      // docusign tabs
      dsTabs.signHereTabs = [
        docusign.SignHere.constructFromObject({
          anchorString: 'Employee Signature',
          anchorYOffset: '-0.3', anchorUnits: 'inches'
        })
      ];
      dsTabs.dateSignedTabs = [
        docusign.DateSigned.constructFromObject({
          anchorString: 'Date', anchorYOffset: '-0.3', anchorUnits: 'inches'
        })
      ];
      dsTabs.checkboxTabs = [
      ];

      dsTabs.textTabs = [
        makeTextTab('Employee:', 0.7, 150, body.parentName),
      ];
      break;
    default:
      throw new Error('Document not found');
  }
  return {
    docPath: doc,
    displayName: displayName,
    prefillVals: prefillVals,
    dsTabs: dsTabs, // signHereTabs, dateSignedTabs, checkboxTabs, textTabs
    recipients: recipients // signers
  };
}
