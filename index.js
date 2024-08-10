const express =require('express')
const cors =require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()

const corsOptions ={
    origin: ['http://localhost:5173','http://localhost:5174'],
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x22d1po.mongodb.net/?appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    const serviceCollection =client.db('BeautyService').collection('service')
    // get all service data from mongo
    app.get('/service',async(req,res)=>{
      const result=await serviceCollection.find().toArray()
      res.send(result)
    })

    // get single data from mongo
    app.get('/service/:id',async(req,res)=>{
      const id =req.params.id;
      const query ={_id : new ObjectId(id)}
      const result = await serviceCollection.findOne(query)
      res.send(result)
    })

    
    // post all service data in db
    app.post('/service',async(req,res)=>{
      const serviceData = req.body;
      // console.log(serviceData)
      // return
      const result = await serviceCollection.insertOne(serviceData)
      res.send(result)
    })

    // manage service for specific email by get data
    app.get('/services/:email',async(req,res)=>{
      const email =req.params.email;
      const query ={'serviceProvider.email': email }
      const result=await serviceCollection.find(query).toArray();
      res.send(result)
   })
  //  delete service for specific 
  app.delete('/service/:id',async(req,res)=>{
    const id =req.params.id;
    const query ={ _id: new ObjectId(id) }
    const result = await serviceCollection.deleteOne(query);
    res.send(result)

  })
   // update data 
   app.put('/service/:id', async (req, res) => {
    const id = req.params.id;
    const serviceData = req.body;
    const filter = { _id: new ObjectId(id) }
    const options = { upsert: true }
    const updateDoc = {
      $set: {
        ...serviceData,
      }

    }
    const result = await serviceCollection.updateOne(filter, updateDoc, options)
    res.send(result)

  })




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('beauty')
})
app.listen(port,()=>console.log(`server is running on port ${port}`))

