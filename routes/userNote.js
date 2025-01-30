const express = require('express');
const ValidateToken = require('../middleware/validation');
const CreateNoteModel = require('../models/CreateNote.Model');

const router = express.Router();

router.get('/', ValidateToken, async(req, res) => {
    res.render('index',{ user: req.user });
});

router.get('/createNote', ValidateToken, async(req, res) => {
    res.render('createNote',{ Msg:"", user});
});

router.post('/create', ValidateToken, async(req, res) => {
    try {
        const {Title, Content} = req.body;

        if(!Title || Content){
            return res.status(400).render('createNote',{Msg:"All inputs are required"})
        }

        const user = await CreateNoteModel.create({
            Title,
            Content,
            UserId:req.user.id
        });
        res.status(200).render('index',{user});

    } catch (error) {
        console.log("Error creating notes",error);
        res.status(404).render('createNote',{Msg: "error creating note"});
    }
});

router.get('/getAllNotes', ValidateToken, async(req, res) => {
    try {
        const Notes = await CreateNoteModel.find({UserId:req.user.id});
        res.status(200).render('/home',{Notes});

        if(!Notes){
            return res.status(200).render('/home', {Msg:"no Note available to display"})
        }

    } catch (error) {
        console.log("error trying to get Notes", error);
        res.status(400).render('/home',{Msg:"error displaying notes"})
    }
});



module.exports = router;