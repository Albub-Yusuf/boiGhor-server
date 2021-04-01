const express = require('express');
const app = express();
const port = process.env.Port || 5000;
const cors = require('cors');
require('dotenv').config();





app.use(express.json());
app.use(cors());



const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v8mjz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const ObjectId = require('mongodb').ObjectId;

client.connect(err => {
  const collection = client.db("bookStore").collection("books");
  const orderCollection = client.db("bookStore").collection("orders");

  // perform actions on the collection object

  //get all
  app.get('/books',(req, res) => {

    collection.find()
    .toArray((err, documents) =>{
        res.send(documents);
    })
  })

//create new book info
app.post('/addBook',(req, res) => {

  const newBook = req.body;
  collection.insertOne(newBook)
  .then(result => {
    
      res.send(result.insertedCount > 0);
  })

 

})



  //fetch single book
  app.get('/book/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })



  //delete book
  app.delete('/delete/:id', (req, res) => {
;
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then( (err, result) => {
      res.send('book deleted successfully')
    })
  })


  //order create
  app.post('/addOrder', (req, res)=>{

    const order = req.body;
    orderCollection.insertOne(order)
    .then(result => {
      res.send(result.insertedCount > 0);
    })

  })


  //conditional fetch
  app.get('/orders/:email', (req, res)=>{

    orderCollection.find({email: req.params.email})
    .toArray((err, documents) => {
      res.send(documents);
    })

  })

  console.log('db connected');

  //client.close();
});






app.get('/',(req, res) => {

    res.send('express server started');

})



app.listen(process.env.PORT || port);