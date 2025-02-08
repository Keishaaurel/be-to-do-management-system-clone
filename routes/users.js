var express = require('express');
var router = express.Router();
exports.router = router;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.prisma = prisma;
const bcrypt = require('bcrypt');
const { stringify } = require('jade/lib/utils');

// Get All Users
router.get('/get-all', async function (req, res, next) {
  const users = await prisma.user.findMany();
  if (users.length === 0 || users === null || users === undefined) {
    res.json('nooo users found (╥﹏╥)');
  } else {
    res.send(users);
  }
});

// Get User by ID
router.get('/get-user/:id', async function (req, res, next) {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (user === null || user === undefined) {
    res.json(`user with id ${id} not found (╥﹏╥)`);
  } else {
    res.send(user);
  }
});

// Create User
router.post('/create', async function (req, res, next) {
  const { name, email, password } = req.body;
  // name === '' ? res.json('Please fill the name fields') :
  //   email === '' ? res.json('Please fill the email fields') :
  //     password === '' ? res.json('Please fill the password fields') : (async () => 
    
    if(name === '' || email === '' || password === ''){
      res.json('fill all fields');
    } else {
        const hashPassword = await bcrypt.hash(password, 10);
        const stringPassword = await stringify(hashPassword);
        const user = await prisma.user.create({
          data: {
            username: name,
            email,
            password: stringPassword,
          },
        });
        res.status(200).json({
          message: 'user created successfully! (˶˃ ᵕ ˂˶)',
          user
        })
      }
    // )
});

// Update User
router.put('/update/:id', async function (req, res) {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const hashPassword = bcrypt.hash(password, 10);
  const stringPassword = stringify(hashPassword);
  name === '' ? res.json('Please fill the name field') : email === '' ? res.json('Please fill the email field') : password === '' ? res.json('Please fill the password field') : (async () => {
    const user = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        username: name,
        email,
        password: stringPassword,
      },
    });
    res.send(user);
  })
});


// Delete User
router.delete('/delete/:id', async function (req, res, next) {
  const { id } = req.params;
  const userExist = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  userExist === null ? res.json(`user with id ${id} not found`) : (async () => {
    const user = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({
      message: 'User deleted',
      user
    })
  })
});

module.exports = router;