const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;

const app = express()
app.use(cors())
app.use(express.json());

const PORT = process.env.PORT || 5000

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
      await client.connect();

    const db = client.db("wanderlust-website-data");
    const destinationCollection = db.collection("test-destinationCollection");

    app.get("/destinations", async (req, res) => {
        const result = await destinationCollection.find().toArray();
        res.json(result);
    });

// Get all destinations data
//     app.get("/destinations", async (req, res) => {

//     const result = await destinationsCollection.find().toArray();

//     res.send(result);
// });



    app.post("/destinations", async (req, res) => {
        const destination = req.body;
        console.log(destination);
        const result = await destinationCollection.insertOne(destination);
        res.json(result);
    });

    // Get a single destination details by ID
    app.get("/destinations/:id", async (req, res)=>{
      const {id} = req.params

      const result = await destinationCollection.findOne({_id: new ObjectId(id)});
      res.json(result);
    })

    // Update a destination by ID
    app.patch("/destinations/:id", async (req, res)=>{
      const {id} = req.params
      const updatedData = req.body;

      const result = await destinationCollection.updateOne(
        {_id: new ObjectId(id)},
        {$set: updatedData}
      );
      res.json(result);
    });

    // Delete a destination by ID
    app.delete("/destinations/:id", async (req, res)=>{
      const {id} = req.params;

      const result = await destinationCollection.deleteOne({_id: new ObjectId(id)});
      res.json(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Server is running fine!")
})


app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
})