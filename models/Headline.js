var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var HeadlineSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String, 
        required: true
    }, 

    link: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true

    },

    newssite_full: {
        type: String,
        required: true
    },

    newssite_abbr: {
        type: String,
        required: true,
    },
    
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Headline = mongoose.model("Headline", HeadlineSchema);

module.exports = Headline;