const express = require('express');
const mongodb = require('mongodb');
/* const mongoose = require("mongoose"); */
const router = express.Router();


//Note: The / reference the route '/api/posts'
//GET all posts
router.get("/", async (req, res) =>
{
   const posts = await loadPostsCollection();
   await posts.find({}).sort({"createdAt":-1}).toArray()
   .then(result =>
   {
      res.status(200).json(result);
   })
   .catch(err => 
   {
      console.log(err);
      res.status(500).json({
         error: err
      });
   });

   //const posts = await loadPostsCollection();
   //res.send(await posts.find({}).toArray());
});


//GET a specific post http://localhost:3000/courses/id
router.get("/:id", async (req, res) =>
{
   const posts = await loadPostsCollection();
   await posts.find({ _id: new mongodb.ObjectID(req.params.id) }).toArray()
   .then(result =>
   { 
      res.status(200).json(result); 
   })
   .catch(err => 
   {
      console.log(err);
      res.status(500).json({
         error: err
      });
   });


  //const id = req.params.id;
  //const posts = await loadPostsCollection();
  //res.send(await posts.find({ _id: new mongodb.ObjectID(req.params.id) }).toArray());
});


//Create a post and save into mongodb
router.post("/", async (req, res) =>
{
   const posts = await loadPostsCollection();
   await posts.insertOne({
      title: req.body.title,
      label: req.body.label,
      position: req.body.position,
      text: req.body.text,
      wrapping: req.body.wrapping,
      createdAt: req.body.createdAt,
      modified: req.body.modified
   }).then(result =>
   {
      res.status(201).send();
   })
      .catch(err => 
      {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });

  /* const posts = await loadPostsCollection();   
    await posts.insertOne({
       title : req.body.title,
       label : req.body.label,
       position : req.body.position,
       text : req.body.text,
       wrapping : req.body.wrapping,
       createdAt: req.body.createdAt,
       modified: req.body.modified
    });
    res.status(201).send(); */
});


//Delete a specific post http://localhost:3000/courses/id
router.delete("/:id", async (req, res) =>
{
   const posts = await loadPostsCollection();
   await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) })
   .then(result =>
   {
      res.status(200).json(result);
   })
   .catch(err => 
   {
      console.log(err);
      res.status(500).json({
         error: err
      });
   });

   //const posts = await loadPostsCollection();
   //await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
   //res.status(200).send();
});


router.put("/:id", async (req, res) =>
{
   const id = req.params.id;
   const updateObj = {};

   if (req.body.title) updateObj.title = req.body.title;
   if (req.body.label) updateObj.label = req.body.label;
   if (req.body.position) updateObj.position = req.body.position;
   if (req.body.wrapping) updateObj.wrapping = req.body.wrapping;
   if (req.body.text) updateObj.text = req.body.text;
   if (req.body.createdAt) updateObj.createdAt = req.body.createdAt;
   if (req.body.modified) updateObj.modified = req.body.modified;

   const posts = await loadPostsCollection();
   await posts.updateOne({ _id: new mongodb.ObjectID(id) }, { $set: updateObj })
      .then(result =>
      {
         res.status(200).json(result);
      })
      .catch(err => 
      {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });
});

async function loadPostsCollection()
{
   const client = await mongodb.MongoClient.connect
   ('mongodb://tony:Pissen30060@ds237072.mlab.com:37072/atticdb', {
         useNewUrlParser: true, useUnifiedTopology: true });
   return client.db('atticdb').collection('posts');
}

module.exports = router;
