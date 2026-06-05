const prisma = require('../prismaClient');

const Get_AllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const user = await prisma.user.create({
      data: { email, name },
    });
    res.status(201).json(user);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const Get_UserBy_id = async (req, res) => {  
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    };

    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    };

    const users = await prisma.user.findUnique({
      where : {id : userId}, 
    });
    
    if (!users) {
      return res.status(404).json({ error: "User not found" });
    };

    return res.status(200).json(users);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const Get_User_BalanceBy_Id = async (req, res) => {
try {

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  };

  const userId = parseInt(id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid User ID" });
  };

  const users = await prisma.user.findUnique({
      where : {id : userId}, 
      select: {
        id: true,
        name: true,
        account : {
          select : {
            balance : true
          }
        }
      },
  });
      
  if (!users) {
    return res.status(404).json({ error: "User not found" });
  };

  return res.status(200).json(users);

} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}};

module.exports = {Get_AllUser, createUser, Get_User_By_id, Get_User_Balance};