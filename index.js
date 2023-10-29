const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT||5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());



app.get('/',(req,res)=>{
    res.send('Espresso Emporium is running.');
})

app.listen(PORT,()=>{
    console.log(`Espresso Emporium is running on port:${PORT} `);
})



//Mongo Start

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x055mra.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

     // Connect to the "insertDB" database and access its "haiku" collection
     const coffeeCollection = client.db("coffeeDB").collection('coffee');
     const QuestionCollection = client.db("coffeeDB").collection('questions');

     app.get('/coffee',async(req,res)=>{
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result);
     })

     app.get('/coffee/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.findOne(query);
        res.send(result);
     })

     app.post('/coffee',async(req,res)=>{
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result);
    })

    app.post('/question',async(req,res)=>{
        const Qsndata = req.body;
        const result = await QuestionCollection.insertOne(Qsndata);
        res.send(result);
    })

    app.put('/coffee/:id',async(req,res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert:true};
        const updatedCoffee = req.body;
        const Coffee = {
            $set: {
            name:updatedCoffee.name,
            quantity:updatedCoffee.quantity,
            supplier:updatedCoffee.supplier,
            taste:updatedCoffee.taste,
            category:updatedCoffee.category,
            photo:updatedCoffee.photo
            }
        }
        const result = await coffeeCollection.updateOne(filter,Coffee,options);
        res.send(result);
    })

    app.delete('/coffee/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



//Mongo End