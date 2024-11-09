const model = require('../models/user');
const Story = require('../models/story');

exports.new = (req, res)=>{
        return res.render('./user/new');
};

// Handle the signup form
exports.create = (req, res, next)=>{
         let user = new model(req.body);
        user.save()
        .then( result => {
            if (result) {
                req.flash('success', 'You have successfully signed up');
                res.redirect('/users/login');
            }
        })
        .catch(err=>{
            if(err.name === 'ValidationError' ) {
                req.flash('error', err.message);  
                return res.redirect('/users/new');
            }

            if(err.code === 11000) {
                req.flash('error', 'Email has been used');  
                return res.redirect('/users/new');
            }
            
            next(err);
        }); 
};


exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');
}

// Handle user login
exports.login = (req, res, next)=>{
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            console.log('wrong email address');
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

// Handle user profile
exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), Story.find({author: id})])
    .then(results=>{
        const [user, stories] = results;
        res.render('./user/profile', {user, stories} );
    })
    .catch(err=>next(err));
};

// Handle user logout
exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };


