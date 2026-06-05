const express = require('express');
const router = express.Router();
const { Get_AllUser, createUser, Get_UserBy_id, Get_User_BalanceBy_Id} = require('../controllers/user');
const { createAcc, Get_AccountBy_id, handle_Transfer } = require('../controllers/Account');

//Users Created
router.get('/users', Get_AllUser);
router.post('/users', createUser);
router.get('/users/:id', Get_UserBy_id);
router.post('/users/balance', Get_User_BalanceBy_Id);

//Accounts Created
router.post('/create/account', createAcc);
router.get('/users/Account-balance/:id', Get_AccountBy_id);
router.post('/start/transfer', handle_Transfer);
router.get('/users/trasaction/history/:userId', Get_AccountBy_id);


//Create an API for displaying Transaction Record with
// id, From Username, To Username , amount , Status, Time

module.exports = router;