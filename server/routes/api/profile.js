const express = require('express');
const { validationResult, check } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const axios = require('axios');

//@route  GET api/profile/me
//@desc   Get Current user profile
//@access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'No profile exists for this user' });
    }
    res.json(profile);
  } catch (err) {
    //console.error(err.message);
    res.status(500).json({ msg: 'Server error while getting profile' });
  }
});

//@route  POST api/profile
//@desc   Create user profile
//@access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.status = status;
    profileFields.skills = skills.split(',').map((skill) => skill.trim());
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;

    //console.log(profileFields);

    //Build social object in profile
    const socialFields = {};
    if (youtube) socialFields.youtube = youtube;
    if (twitter) socialFields.twitter = twitter;
    if (facebook) socialFields.facebook = facebook;
    if (linkedin) socialFields.linkedin = linkedin;
    if (instagram) socialFields.instagram = instagram;
    profileFields.social = socialFields;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      // Update profile if profile found
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //Create profile if profile not found
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      // console.error(err.message);
      res.status(500).send('Internal server error when creating profile');
    }
  }
);

//@route  GET api/profile
//@desc   Get all profiles
//@access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Internal server error when getting all profiles');
  }
});

//@route  GET api/profile/user/:user_id
//@desc   Get profile by user_id
//@access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json('No profile found');
    }
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    //if user_id ObjectId is invalid
    if (err.kind === 'ObjectId') {
      return res.status(400).json('No profile found');
    }
    res.status(500).json('Internal server error when getting profile');
  }
});

//@route  DELETE api/profile
//@desc   Delete posts, profile and User
//@access Private
router.delete('/', auth, async (req, res) => {
  try {
    //remove all posts of user
    await Post.deleteMany({ user: req.user.id });
    /*  Used findOneAndDelete() instead of findOneAndRemove() - this function uses MongoDB's
        findAndModify() with 'remove' flag which was higher time complexity        */
    await Profile.findOneAndDelete({ user: req.user.id });
    await User.findOneAndDelete({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    // console.error(err.message);
    res.status(500).json('Internal server error when deleting User');
  }
});

//@route  PUT api/profile/experience
//@desc   add profile experince
//@access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From Date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      //Add latest experience
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);

      await profile.save();
      res.json(profile);
    } catch (err) {
      // console.error(err.message);
      res
        .status(500)
        .json('Internal server error when creating profile experience');
    }
  }
);

//@route  DELETE api/profile/experience/:exp_id
//@desc   Delete profile experince
//@access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get index of experience
    const expIndex = profile.experience
      .map((item) => item._id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(expIndex, 1);

    await profile.save();

    //return latest profile to update in react
    return res.status(200).json(profile);

    //res.json({ msg: 'Experience deleted' });
  } catch (err) {
    //console.error(err.message);
    return res
      .status(500)
      .json('Internal server error when deleting Experience');
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  '/education',
  auth,
  check('school', 'School is required').notEmpty(),
  check('degree', 'Degree is required').notEmpty(),
  check('fieldofstudy', 'Field of study is required').notEmpty(),
  check('from', 'From date is required and needs to be from the past')
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(req.body);

      await profile.save();

      res.json(profile);
    } catch (err) {
      //console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education = profile.education.filter(
      (edu) => edu._id.toString() !== req.params.edu_id
    );
    await profile.save();
    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      'User-Agent': 'node.js',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_GITHUBTOKEN}`,
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    //console.error(err.message);
    return res.status(404).json({ msg: 'No Github profile found' });
  }
});

module.exports = router;
