const mongoose = require('mongoose');
const CreateNoteSchema = new mongoose.Schema({
    Title:{
        type:String,
        required:[true, "title is required"]
    },
    Content:{
        type:String,
        required:[true, "content is required"]
    },
    UserId:{
        type:String,
        required:true
    },
},{timestamps:true});

module.exports = mongoose.model('CreateNote', CreateNoteSchema);