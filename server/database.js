const database  = exports
    , {MongoClient} = require('mongodb')
    , dsConfig = require('../config/index.js').config;

const uri = `mongodb+srv://docusigndev:${dsConfig.mongodbPassword}@democluster.a5pbd.mongodb.net/docusignDev?retryWrites=true&w=majority`
    , client = new MongoClient(uri);

mongodb.connect(
    connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, client) {
        db = client.db()
        console.log("connected to mongodb server");
    }
)