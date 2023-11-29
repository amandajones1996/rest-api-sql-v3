const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const { User, Course } = require('./models'); 
const authUser = require('./middleware/authUser'); 

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}
// user routes
router.get('/users', authUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.status(200).json(user);
}));

router.post('/users', asyncHandler(async (req, res) => {
  try {
    let user = req.body
    if(user.password){
        user.password = bcrypt.hashSync(user.password, 10); 
    }
    await User.create(user);
    res.status(201).location('/').end();
  } catch (error) {
    if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
        const errors = error.errors.map(e => e.message)
        res.status(400).json({errors});
    } else {
        throw error
    }
  }
}));

// Course Routes
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'emailAddress']}]
  });
  if(!courses){
    res.status(404).json({message: 'No courses found'});
  } else {
  res.status(200).json(courses);
  }
}));

router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'emailAddress'] }]
  });
  if (course) {
    res.status(200).json(course);
  } else {
    res.status(404).json({ message: "The course was not found" });
  }
}));

router.post('/courses', authUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).location(`/courses/${course.id}`).end();
  } catch (error) {
    if(error.name === 'SequelizeValidationError'){
    res.status(400).json({ errors: error.errors.map(err => err.message) });
    } else{
        throw error
    }
  }
}));

router.put('/courses/:id', authUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
        res.status(404).json({ message: "The course was not found" });
    } 

    if (course.userId !== req.currentUser.id) {
        return res.status(403).json({ message: 'Failed authentication. Course could not be updated.' });
    }
    await course.update(req.body);
    res.status(204).end();
}));

router.delete('/courses/:id', authUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    res.status(404).json({ message: "The course was not found" });
  } 
  if (course.userId !== req.currentUser.id) {
    return res.status(403).json({ message: 'Course could not be deleted. Only owners may delete a course' });
    }
  await course.destroy();
  res.status(204).end();
}));

module.exports = router;