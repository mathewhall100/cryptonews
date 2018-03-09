var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({

    author: {
        type: String,
    },

    text: {
        type: String, 
    }, 

    date: {
        type: String,
        required: true
    }

});


var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;