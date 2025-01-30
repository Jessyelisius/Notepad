const express = require('express');
const ValidateToken = require('../middleware/validation');
const CreateNoteModel = require('../models/CreateNote.Model');

const router = express.Router();

router.get('/', ValidateToken, async(req, res) => {
    res.render('index',{ user: req.user, Notes:[], Msg:"" });
});

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

router.get('/getAllNotes', ValidateToken, async(req, res) => {
    try {
        console.log('fetching notes for user:', req.user.id);
        console.log('user id:', req.user.id);
        
        const Notes = await CreateNoteModel.find({UserId:req.user.id});
        console.log('notes form user', Notes);
        
        if(Notes.length === 0){
            console.log('no note found for this user');
            
            return res.status(400).render('index', {user: req.user, Notes:[], Msg:"No Note available to display"})
        }

        return res.status(200).render('index',{user:req.user, Notes});

    } catch (error) {
        console.log("error trying to get Notes", error);
        res.status(400).render('index',{user:req.user, Notes:[], Msg:"error displaying notes"})
    }
});



module.exports = router;