const mongoose = require('mongoose');

//check if the user id exist
exports.validateId = (req, res, next) => {
    const id = req.params.id;
    
    if (mongoose.Types.ObjectId.isValid(id)) {
        next();
    } else {
        const err = new Error('Invalid story id');
        err.status = 400;
        next(err);
    }
};