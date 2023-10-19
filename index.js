const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
var cors = require('cors')
require('dotenv').config()
const app = express();
const port = 5001;



app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World! How are you?');
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_Pass}@cluster0.alzohbu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const brandsCollection = client.db('brandDB').collection('brands');

        app.post('/brands', async(req, res) => {
            const newBrand = req.body;
            console.log('adding new brand', newBrand);
            const result = await brandsCollection.insertOne(newBrand);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})