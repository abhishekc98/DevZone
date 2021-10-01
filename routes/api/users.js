const express = require('express');
const gravatar = require('gravatar');
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcryptjs');
//for getting jwtSecret
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const router = express.Router();

//@route  POST api/users
//@desc   Register user
//@access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], 
async (req, res) => {
    //console.log(req.body);
    const errors = validationResult(req);

    // If having error then return array containing error messages
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {name, email, password} = req.body;

    try{

        let user = await User.findOne({ email });
        
        // If user already exists
        if(user){
            return res.status(400).json({ error: [{ msg: 'User already exists' }] });           
        }

        //Set avatar
        const avatar = gravatar.url(email, {
            s: '200', r: 'pg', d: 'mm'
        });

        //Create User
        user = new User({
            name,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();

        //for mongoose instead of user._id , we can write user.id
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'), 
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            }
        );
        //res.send('User Registered');
    }catch(err){
        console.error(err.message);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;