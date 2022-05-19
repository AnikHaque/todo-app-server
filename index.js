const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json()); 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lx750.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("orgafe");
      const todoCollection = database.collection("todo");
      


   
//  get api for showing all tasks , managing all items and my items     
 
app.get('/todo', async(req, res) => {
  const cursor = todoCollection.find({});
  const hotels = await cursor.toArray();
  res.send(hotels);
})






// delete task 
app.delete('/task/:id', async(req, res) =>{
  const id = req.params.id;
  const query = {_id: ObjectId(id)};
  const result = await todoCollection.deleteOne(query);
  res.send(result);
})

// update task 
app.put('/task/:id', async(req,res)=>{
  const id = req.params.id;
  const updated = req.body;
  const filter = {_id:ObjectId(id)};
  const options = { upsert: true};
  console.log(updated);
  const updatedDoc = {
    $set:{
      quantity:updated.quantity
    }
  };
  const result = await todoCollection.updateOne(filter, updatedDoc, options);
  res.send(result);
})


//   // POST API TO ADD todo OF ANY task 
app.post('/todo', async(req, res) => {
  const newroom = req.body; 
  const result = await todoCollection.insertOne(newroom);
  console.log('hitting the post',req.body);      
  res.json(result);
        
}) 

    } 
    finally {
      
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
