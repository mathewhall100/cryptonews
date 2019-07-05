var express = require("express");
var routerHome = express.Router();
var db = require("../models");


// ====================================
// create routes with logic as required
// ===================================


// route for /

routerHome.post("/save", function (req, res) {

        var saveData = req.body;
        var note = {
                author: saveData.author,
                text: saveData.text,
                date: saveData.date,
        };

        db.Note.create(note)
                .then(function (note) {

                        var article = {
                                title: saveData.article.title,
                                description: saveData.article.description,
                                image: saveData.article.image,
                                link: saveData.article.link,
                                date: saveData.article.date,
                                newssite_full: saveData.article.newssite_full,
                                newssite_abbr: saveData.article.newssite_abbr,
                                note: note._id,
                        }

                        //console.log(article)

                        db.Headline.create(article)
                                .then(function (article) {
                                        res.json(article)
                                })
                                .catch(function (err) {
                                        console.log('ERROR", err')
                                        res.json(err);
                                });

                });


});

routerHome.get("/saved", function (req, res) {

        db.Headline.find({})
                .populate('note')
                .then(function (articlesList) {

                        var hbsObj = {
                                articles: articlesList
                        };

                        //console.log(hbsObj)
                        res.render("saved", hbsObj)
                })

});


routerHome.delete("/delete", function (req, res) {

        db.Headline.remove({
                        _id: req.body.id
                })
                .then(function (deletedHeadline) {

                        db.Note.remove({
                                        _id: req.body.note
                                })
                                .then(function (deletedNote) {
                                        console.log(deletedHeadline);
                                        console.log(deletedNote);
                                        res.json(deletedHeadline)
                                })
                                .catch(function (err) {
                                        console.log('ERROR", err')
                                        res.json(err);
                                });
                });
});


routerHome.put("/note-update", function (req, res) {

        var note = req.body;

        console.log("note :" + note.text)
        console.log("note :" + note.author)
        console.log("note :" + note.date)
        console.log("note :" + note.id)

        db.Note.update({
                       "_id": note.id},{$set: {"author": note.author, "text": note.text, "date": note.date}
                })
                .then(function (updatedNote) {
                        console.log(updatedNote)
                        res.json(updatedNote)
                })
                .catch(function (err) {
                        console.log('ERROR", err')
                        res.json(err);
                });

});


// export routes for use in server.js

module.exports = routerHome;