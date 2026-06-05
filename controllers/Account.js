const prisma = require('../prismaClient');

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

module.exports = {
    createAcc,
    Get_AccountBy_id
};