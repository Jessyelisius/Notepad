const express = require('express');
const ValidateToken = require('../middleware/validation');
const CreateNoteModel = require('../models/CreateNote.Model');

const router = express.Router();

/////////////////////////////////////create note route////////////////////////

router.get('/createNote', ValidateToken, async(req, res) => {
    res.render('createNote',{ Msg:""});
});

router.post('/create', ValidateToken, async(req, res) => {
    try {
        const {Title, Content} = req.body;

        if(!Title || !Content){
            return res.status(400).render('createNote',{Msg:"All inputs are required"})
        }

        const user = await CreateNoteModel.create({
            Title,
            Content,
            UserId:req.user.id
        });
        res.redirect('/home');

    } catch (error) {
        console.log("Error creating notes",error);
        res.status(404).render('createNote',{Msg: "error creating note"});
    }
});
//////////////////////////////get all note route//////////////////////////////

router.get('/', ValidateToken, async(req, res) => {
    try {
        const Notes = await CreateNoteModel.find({UserId:req.user._id});

        res.render('index', {
            Notes: Notes.length ? Notes : [],
            Msg: Notes.length ? null : "No Notes available."
        });
    } catch (error) {
        console.log("error trying to get Notes", error);
        res.status(400).render('index',{ Notes:[], Msg:"error displaying notes"});
    }
});

///////////////////////////get single notr route////////////////////////

router.get('/getSingleNote/:id', ValidateToken, async (req, res) => {
    try {
        const id = req.params.id;
        if(!id){
            return res.status(400).render('index',{Msg:"no id specified", Note:[]})
        }

        const Note = await CreateNoteModel.findById(id);
        if (!Note) {
            return res.status(400).render('index', { Msg: "No note found", Note: [] });
        }
        res.status(200).render('viewNote', { Note, Msg: "" });

    } catch (error) {
        console.log("Error fetching note:", error);
        res.status(400).render('index', { Note: [], Msg: "Error displaying note" });
    }
});


/////////////////////////update route/////////////////////////////////

router.get('/updateNote/:id', ValidateToken, async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).render('index', { Msg: "Please specify a note ID" });

        const Note = await CreateNoteModel.findById(id);
        if (!Note) return res.status(404).render('index', { Msg: "Note not found" });

        res.render('updateNote', { Msg: "", updateNote: Note });
    } catch (error) {
        console.log("Error fetching note for update:", error);
        res.status(400).render('updateNote', { Msg: "Error fetching note" });
    }
});

router.post('/updateNote/:id', ValidateToken, async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).render('index', { Msg: "Please specify an ID to update" });

        const { Title, Content } = req.body;
        if (!Title || !Content) {
            const Note = await CreateNoteModel.findById(id);
            return res.status(400).render('updateNote', { Msg: "All inputs are required", updateNote: Note });
        }

        const updatedNote = await CreateNoteModel.findByIdAndUpdate(
            id,
            { Title, Content },
            { new: true } //returns the updated note
        );

        if (!updatedNote) return res.status(404).render('index', { Msg: "Note not found" });

        res.redirect('/home');
    } catch (error) {
        console.log("Error updating note:", error);
        res.status(400).render('updateNote', { Msg: "Error trying to update note" });
    }
});

////////////////////////////////////delete note route/////////////////////////////////
router.get('/delete/:id', ValidateToken, async(req, res) => {
    try {
        const id = req.params.id;
        if(!id){
            return res.status('viewNote',{Msg:"Note not found"})
        }
        const Note = await CreateNoteModel.findByIdAndDelete(id)
        if(!Note){
            return res.status(400).render('viewNote',{Msg:"Note doent exit or deleted", Note:{}})
        }
        res.redirect('/home')
    } catch (error) {
        console.log("Error deleting note:", error);
        res.status(400).render('updateNote', { Msg: "Error trying to delete note" });
    }
})

module.exports = router;