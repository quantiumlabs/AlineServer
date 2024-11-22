import { Router, Request, Response, RequestHandler } from 'express';
import { prisma } from '../../config/prisma';

const router = Router();

interface QueryParams {
  password?: string;
}

const getPayments: RequestHandler = async (req, res) => {
  try {
    const { password } = req.query;
    
    if (password !== process.env.ADMIN_PASSWORD) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

router.get('/payments', getPayments);

export default router;