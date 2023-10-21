require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
var cors = require('cors')
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
        //await client.connect();

        const brandsCollection = client.db('brandDB').collection('brands');
        const productsCollection = client.db('brandDB').collection('products');
        const imagesCollection = client.db('brandDB').collection('images');
        const cartCollection = client.db('brandDB').collection('addToCart');

        app.post('/brands', async(req, res) => {
            const newBrand = req.body;
            console.log('adding new brand', newBrand);
            const result = await brandsCollection.insertOne(newBrand);
            res.send(result);
        })

        app.get('/brands', async(req, res) => {
            const cursor = brandsCollection.find({});
            const brands = await cursor.toArray();
            res.send(brands);
        })

        app.post('/products', async(req, res) => {
            const newProduct = req.body;
            console.log('adding new product', newProduct);
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        })

        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        app.delete('/products/:id', async(req, res) => {
            const id = req.params.id;
            console.log('delete this', id);
            const query = {_id: new ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        })

        app.get('/images', async(req, res) => {
            const cursor = imagesCollection.find({});
            const images = await cursor.toArray();
            res.send(images);
        })

        app.get('/images/:brand', async(req, res) => {
            const brand = req.params.brand;
            const query = { brand: brand };
            const result = await imagesCollection.findOne(query);
            res.send(result);
        })
        


        app.put('/products/:id', async(req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            console.log('updating product', id);
            const filter = {_id: new ObjectId(id)};
            const options = {upsert: true};
            const product = {
                $set: {
                    productName: updatedProduct.productName,
                    price: updatedProduct.price,
                    ratings: updatedProduct.ratings,
                    brandName: updatedProduct.brandName,
                    type: updatedProduct.type,
                    details: updatedProduct.details,
                    photo: updatedProduct.photo
                },
            };
            const result = await productsCollection.updateOne(filter, product, options);
            res.send(result);
        })

        app.post('/addToCart', async(req, res) => {
            const newCart = req.body;
            console.log('adding new cart', newCart);
            const result = await cartCollection.insertOne(newCart);
            res.send(result);
        })

        app.get('/addToCart', async(req, res) => {
            const cursor = cartCollection.find({});
            const cart = await cursor.toArray();
            res.send(cart);
        })
        app.get('/addToCart/:email', async(req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await cartCollection.find(query).toArray();
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