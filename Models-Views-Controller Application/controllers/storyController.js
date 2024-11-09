const model = require('../models/story');

exports.index = (req, res, next)=>{
    model.find()
    .then(stories=>res.render('./story/index', {stories}))
    .catch(err=>next(err));
};

exports.new = (req, res)=>{
    res.render('./story/new');
};

// Handles creating a new story
exports.create = (req, res, next)=>{
    let story = new model(req.body);//create a new story document
    story.author = req.session.user;
    story.save()//insert the document to the database
    .then(story=> res.redirect('/stories'))
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            err.status = 400;
        }
        next(err);
    });
    
};

// Send details of story identified by id
exports.show = (req, res, next)=>{
    let id = req.params.id;

    model.findById(id).populate('author', 'firstName lastName')
    .then(story=>{
        if(story) {       
            return res.render('./story/show', {story});
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

// Send html form for editing an existing story
exports.edit = (req, res, next)=>{
    let id = req.params.id;
   
    model.findById(id)
    .then(story=>{
            return res.render('./story/edit', {story});
    })
    .catch(err=>next(err));
};

// Update the story identified by id
exports.update = (req, res, next)=>{
    let story = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, story, {useFindAndModify: false, runValidators: true})
    .then(story=>{
            res.redirect('/stories/'+id);
    })
    .catch(err=> {
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err);
    });
};

// Delete the story identified by id 
exports.delete = (req, res, next)=>{
    let id = req.params.id;

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(story =>{
            res.redirect('/stories');

    })
    .catch(err=>next(err));
};