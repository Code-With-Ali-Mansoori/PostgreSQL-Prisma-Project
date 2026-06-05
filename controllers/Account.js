const { Prisma } = require('@prisma/client');
const prisma = require('../prismaClient');
const { z, optional } = require("zod");

const Balnace_Schema = z.object({
  id : z.number().optional(),
  userId : z.number().optional(),
  balance: z.number().positive()
});

const Balance_Schema = z.number();

const createAcc = async (req, res) => {
    try {

        const {balance, userId} = req.body;
        
        if (!balance || !userId) {
            return res.status(400).json({ error: 'Data is required' });
        };

        const account = await prisma.account.create({   // ← Correct: prisma.accounts
            data: {
                balance: balance,
                userId: Number(userId),
            },
        });

        if (!account) {
            return res.status(404).json({ error: "User not found" });
        };

        return res.status(400).json({ messsage: 'Account Created',  account });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
  }
};

const Get_AccountBy_id = async (req, res) => {  
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    };

    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    };

    const acc = await prisma.account.findUnique({
      where : {id : userId}, 
    });
    
    if (!acc) {
      return res.status(404).json({ error: "User not found" });
    };

    return res.status(200).json(acc);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}; 

const handle_Transfer =  async (req, res) => {
  try {
    const { amount, from_UserId, To_UserId } = req.body;

    if (!amount || !from_UserId || !To_UserId ) {
      return res.status(400).json({ error: "All details are required! ⚠️" });
    };

    const FromId = parseInt(from_UserId);
    const ToId = parseInt(To_UserId);

    if (isNaN(FromId) || isNaN(ToId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    };

    //Transaction 
    await prisma.$transaction(
      async (tx) => {

        // Lock the Row Until Update Done [Isolation] 
        const user = await tx.$queryRaw` 
          SELECT * FROM "Account" WHERE "userId" = ${FromId} FOR UPDATE`;  

        const From_UserBalance = parseInt(user[0].balance);
        const validate = Balnace_Schema.safeParse({balance : From_UserBalance});//Zod Validation    

        if (!validate.success) {
          console.log(validate.error);
          return;
        };

        //Amount Checking
        if (From_UserBalance < amount) {
            throw new Error("Rollback this transaction due to Insufficient ampunt"); 
            // This triggers rollback
        };

        //Debit
        await tx.account.update({
          where : {
            userId : FromId
          },
          data : {balance : {decrement : amount}}
        });

        //Credit
        await tx.account.update({
          where : {
            userId : ToId
          },
          data : {balance : {increment : amount}}
        });

        //Create History
        await tx.transactions_Records.create({
          data : {
            fromAccountId : FromId,
            toAccountId : ToId,
            amount: amount,
            status: 'Transfer'
          }
        });
                
      },{isolationLevel : Prisma.TransactionIsolationLevel.Serializable});

    return res.status(200).json({message : 'Transafer is Succesfull!!'});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const Get_User_TransactionRecord = async (req, res) => {
try {

  const {userId} = req.params;

  if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
  };

  const id = parseInt(userId);

} catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
}};

module.exports = {
    createAcc,
    Get_AccountBy_id,
    handle_Transfer
};