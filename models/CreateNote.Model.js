const mongoose = require('mongoose');
const CreateNoteSchema = new mongoose.Schema({
    Title:{
        type:String,
        required:[true, "title is required"]
    },
    Content:{
        type:String,
        required:[true, "content is required"]
    }
},{timestamps:true});

module.exports = mongoose.model('CreateNote', CreateNoteSchema);