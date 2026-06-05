const express = require('express');
const router = express.Router();
const { Get_AllUser, createUser, Get_User_By_id, Get_User_Balance } = require('../controllers/user');
const { createAcc, Get_AccountBy_id } = require('../controllers/Account');

router.get('/users', Get_AllUser);
router.post('/users', createUser);
router.get('/users/balance/:id', Get_User_By_id);
router.post('/users/balance/', Get_User_Balance);

router.post('/create/account', createAcc);
router.get('/users/Account-balance/:id', Get_AccountBy_id);


module.exports = router;