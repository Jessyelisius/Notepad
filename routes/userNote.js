const express = require('express');
const ValidateToken = require('../middleware/validation');
const CreateNoteModel = require('../models/CreateNote.Model');

const router = express.Router();

// router.get('/', ValidateToken, async(req, res) => {
//     res.render('index',{ Notes:[], Msg:"" });
// });

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

router.get('/getSingleNote',ValidateToken, async(req, res) => {
    res.render('viewNote',{user, Msg:""})
});

router.get('/getSingleNote/:id', ValidateToken, async(req, res) => {
    try {
        const id = req.params.id;
        const user = await CreateNoteModel.findById(id)
        if(!user){
            return res.status(400).render('index',{Msg:"No user with specified id"})
        }
        res.status(200).render('viewNote', {user, Msg:""})
    } catch (error) {
        console.log("error trying to get a Notes", error);
        res.status(400).render('index',{ Notes:[], Msg:"error displaying notes"});
    }
});



module.exports = router;