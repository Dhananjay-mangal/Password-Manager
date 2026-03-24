const mongoose = require('mongoose');
const express = require('express')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const cors = require('cors')


dotenv.config();

const app = express()
const port = 3000

const dbName = process.env.DB_NAME;

app.use(express.json());

// Middleware
app.use(bodyparser.json())
app.use(cors())

let a = mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// INSERT api
app.post('/', async (req, res) => {
   const password = req.body;
   const db = mongoose.connection.useDb(dbName);
   const collection = db.collection('passwords');
   const findResult = await collection.insertOne(password);
   res.send({success: true, result: findResult})
})

// GET ALL THE PASSWORDS api
app.get('/', async (req, res) => {
   const db = mongoose.connection.useDb(dbName);
   const collection = db.collection('passwords');
   const findResult = await collection.find({}).toArray();
   res.send({success: true, result: findResult})
})

// DELETE api
app.delete('/', async (req, res) => {
   const password = req.body;
   const db = mongoose.connection.useDb(dbName);
   const collection = db.collection('passwords');
   const findResult = await collection.deleteOne(password);
   res.send({success: true, result: findResult})
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})




