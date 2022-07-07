const express = require("express");
var router = express.Router();
const { blogsDB } = require("../mongo");

router.get("/hello-blogs", (req, res, next) => {
  res.json({ message: "Hello from Express" });
});

router.get("/all-blogs", async function (req, res, next) {
  try {
    const collection = await blogsDB().collection("blogs50");
    const blogs50 = await collection.find({}).toArray();
    res.send({ message: blogs50 });
  } catch (e) {
    res.status(500).send("Error fetching posts:" + e);
  }
});

module.exports = router;
