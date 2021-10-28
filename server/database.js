const database  = exports
    , {MongoClient} = require('mongodb')
    , dsConfig = require('../config/index.js').config;

const uri = `mongodb+srv://docusigndev:${dsConfig.mongodbPassword}@democluster.a5pbd.mongodb.net/docusignDev?retryWrites=true&w=majority`
    , client = new MongoClient(uri);

database.populateAidInfo = async (info, collectionName) => {
    try {
        await client.connect();
        console.log("Connected correctly to server");
    
        const db = client.db("docusignDev");
        const col = db.collection(collectionName);
        
        // Insert a single document
        const p = await col.insertOne(info);
        console.log('Successfully added');
        // Find one document
        // const myDoc = await col.findOne();
        // // Print to the console
        // console.log(myDoc);
    } catch (err) {
        console.log(err.stack);
    }
    
    finally {
        await client.close();
    }
}