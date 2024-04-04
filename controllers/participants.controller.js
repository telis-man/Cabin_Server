const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { MongoClient } = require("mongodb");

// router.get("/", async (req, res) => {
//   try {
//     const client = await new MongoClient("mongodb://127.0.0.1:27017").connect();
//     const participantsArray = await client
//       .db("appDB")
//       .collection("participants")
//       .find({})
//       .toArray();
//     await client.close();

//     if (participantsArray.length === 0) {
//       res.status(404).json({ error: "No participants found." });
//       return;
//     }

//     res.send(participantsArray);
//   } catch (error) {
//     console.log("Error getting participants:", error);

//     if (error.name === "MongoNetworkError") {
//       res.status(400).json({ error: "Failed to connect to the database." });
//       return;
//     }

//     res.status(500).send("Internal server error.");
//   }
// });

router.post("/", async (req, res) => {
  const participant = req.body;

  try {
    if (
      !participant ||
      !participant.name ||
      !participant.email ||
      !participant.age
    ) {
      res.status(400).json({
        error:
          "Incomplete participant data. Please provide name, email, and age.",
      });
      return;
    }
    const client = await new MongoClient("mongodb://127.0.0.1:27017").connect();
    await client.db("appDB").collection("participants").insertOne(participant);
    await client.close();
    res.status(201).send(participant);
  } catch (error) {
    console.log("Error posting participant:", error);

    if (error.name === "MongoNetworkError") {
      res.status(400).json({ error: "Failed to connect to the database." });
      return;
    }

    res.status(500).send("Internal server error.");
  }
});

router.put("/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const updatedParticipant = req.body;

  try {
    const client = await new MongoClient("mongodb://127.0.0.1:27017").connect();

    const result = await client
      .db("appDB")
      .collection("participants")
      .updateOne({ _id: id }, { $set: updatedParticipant });

    await client.close();

    if (result.modifiedCount > 0) {
      res.status(200).send("Participant updated successfully.");
    } else {
      res.status(404).send("Participant not found.");
    }
  } catch (error) {
    console.log("Error updating participant:", error);
    res.status(500).send("Internal server error.");
  }
});

router.delete("/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);

  try {
    const client = await new MongoClient("mongodb://127.0.0.1:27017").connect();
    const result = await client
      .db("appDB")
      .collection("participants")
      .deleteOne({ _id: id });

    await client.close();

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Participant deleted successfully." });
    } else {
      res.status(404).json({ error: "Participant not found." });
    }
  } catch (error) {
    console.log("Error deleting participant:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
