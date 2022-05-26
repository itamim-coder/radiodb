const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
var ObjectId = require("mongodb").ObjectId;
const fileUpload = require('express-fileupload');


const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.srriw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){
    try{
        await client.connect();
        const database = client.db('radiodb'); 
        const stationCollection = database.collection('station');
      
    //Add Radio Station
    app.post('/addstation', async (req, res) => {
        const station = req.body;
       
        const result = await stationCollection.insertOne(station);
     
        res.json(result);
    }); 

    //Get All Radio Station
    app.get('/allstation', async (req, res) => {
        const cursor = stationCollection.find({});
        const station = await cursor.toArray();
        res.send(station);
    });  

    //Delete Single Radio Station  
    app.delete("/allstation/:id", async (req, res)=>{
        const result = await stationCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        res.send(result);
    })

    //Get Single Radio Station
    app.get("/allstation/:id", async(req, res) =>{
        const result = await stationCollection
        .find({_id: ObjectId(req.params.id)})
        .toArray();
        res.send(result[0])
    })  

    //Update Single Radio Station
    app.put('/allstation/:id', async (req, res) => {
        const filter = { _id: ObjectId(req.params.id) };
        console.log(req.params.id);
        const options = { upsert: true };
        const result = await stationCollection.updateOne(filter, {
          $set: {
            stationName: req.body.stationName,
            frequency: req.body.frequency,           
          },
        });
        res.send(result);
        console.log(result);
    }); 

    console.log('connected radiodb')

    }
    finally{
        //await client.close();
    }

}

run().catch(console.dir)

app.get('/', (req, res)  =>{
    res.send('ruuning radiodb')
})

app.listen(port, ()=>{
    console.log('running radiodb', port)
})
