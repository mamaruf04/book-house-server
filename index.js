const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// used middleware
app.use(cors());
app.use(express.json());

// dbuser1
// BatSAddSi2uXPAjQ

// Database Connect with user & password
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ajito.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    console.log('db connected');
    const booksCollection = client.db("storeBooks").collection("books");
    const reviewCollection = client.db("reviews").collection("review");
    const historyCollection = client.db("histories").collection("history");

    // Load all book api
    app.get("/books", async (req, res) => {
      const query = {};
      const cursor = booksCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // load single book api
    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await booksCollection.findOne(query);
      res.send(result);
    });

    // Load user email spacific data
    app.get("/book", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = booksCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Books store running");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
