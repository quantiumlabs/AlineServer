import { Router, Request, Response, RequestHandler } from 'express';
import { createCheckout } from '../../services/checkout.service';
import { PaymentRequest } from '../../types/payment';

const router = Router();

const createPayment: RequestHandler = async (req, res) => {
  try {
    const paymentData = req.body as PaymentRequest;
    const checkoutUrl = await createCheckout(paymentData);
    res.json({ checkoutUrl });
  } catch (error) {
    console.error('Error in checkout creation:', error);
    res.status(500).json({ error: 'Failed to create checkout' });
  }
};

router.post('/create', createPayment);

export default router;