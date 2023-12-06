const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzwqfr8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const biodatasCollection = client.db("biodatasdb").collection("biodatas");
    const reviewsdataCollection = client
      .db("biodatasdb")
      .collection("reviews");
    const addtofavouriteCollection = client
      .db("biodatasdb")
      .collection("addtofavourite");

    app.post("/allbiodatas", async (req, res) => {
      const editbiodata = req.body;
      console.log(editbiodata);
      const result = await biodatasCollection.insertOne(editbiodata);
      res.send(result);
    });

   
    
    app.post("/addtofavourite", async (req, res) => {
      const addtofavourite = req.body;
      console.log(addtofavourite);
      const result = await addtofavouriteCollection.insertOne(addtofavourite);
      res.send(result);
    });

    app.post("/reviews", async (req, res) => {
      const reviewsdata = req.body;
      console.log(reviewsdata);
      const result = await reviewsdataCollection.insertOne(reviewsdata);
      res.send(result);
    });
      

     app.get("/reviews", async (req, res) => {
       const cursor = reviewsdataCollection.find();
       const result = await cursor.toArray();
       res.send(result);
     });
    app.delete("/Delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addtofavouriteCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/addtofavourite", async (req, res) => {
      const cursor = addtofavouriteCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/biodatas", async (req, res) => {
      const cursor = biodatasCollection
        .find({ AccountType: "Premium" })
        .limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/revenue", async (req, res) => {
      const cursor = biodatasCollection
        .find();
        
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/allbiodatas", async (req, res) => {
      const filter = req.query;
      const page = filter.page;
      console.log(page)
      const pageNumber = parseInt(page);
      const perPage = 5;
      const skip = pageNumber * perPage;
      console.log(filter);
      let query = {};
      if (req.query.gender) {
        query = { BiodataType: req.query.gender };
      }
      if (req.query.division) {
        query = { PermanentDivisionName: req.query.division };
      }

      const options = {
        sort: {
          Age: filter.sort === "asc" ? 1 : -1,
        },
      };
      const cursor = biodatasCollection
        .find(query, options)
        .skip(skip)
        .limit(perPage);
      const result = await cursor.toArray();
      const biodatascount = await biodatasCollection.countDocuments();
      res.send({ result, biodatascount });

      
    });



    app.get("/viewbiodatas", async (req, res) => {
      console.log(req.query.userEmail);
      let query = {};
      if (req.query?.userEmail) {
        query = { userEmail: req.query.userEmail };
      }
      const cursor = biodatasCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/maleCounter", async (req, res) => {
      const cursor = biodatasCollection.find({ BiodataType: "Male" });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/femaleCounter", async (req, res) => {
      const cursor = biodatasCollection.find({ BiodataType: "Female" });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/marriagesCompleted", async (req, res) => {
      const cursor = biodatasCollection.find({ MarriageCompleted: "Yes" });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/premiumCount", async (req, res) => {
      const cursor = biodatasCollection.find({ AccountType: "Premium" });
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server running port: ${port}`);
});
