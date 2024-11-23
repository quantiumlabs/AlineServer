import { Router, RequestHandler } from 'express';
import { prisma } from '../../config/prisma';

const router = Router();

interface SaveUserInfoBody {
  password?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}


interface QueryParams {
  password?: string;
}

// Handler to save user information
const saveUserInfo: RequestHandler = async (req, res) => {
  try {
    const { password, ...userInfo } = req.body as SaveUserInfoBody;

    // Check for the correct password
    if (password !== "123") {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Save the user information in the database
    const savedUserInfo = await prisma.userInfo.create({
      data: {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        company: userInfo.company,
      },
    });

    res.status(201).json({ success: true, user: savedUserInfo });
  } catch (error) {
    console.error('Error saving user information:', error);
    res.status(500).json({ error: 'Failed to save user information' });
  }
};

// Handler to view all user information
const viewAllUserInfo: RequestHandler = async (req, res) => {
  try {
    const { password } = req.query as QueryParams;

    // Check for the correct password
    if (password !== "123") {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Fetch all user information from the database
    const userInfoList = await prisma.userInfo.findMany();

    res.json({ users: userInfoList });
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
};

router.post('/userinfo/save', saveUserInfo);
router.get('/userinfo', viewAllUserInfo);

export default router;