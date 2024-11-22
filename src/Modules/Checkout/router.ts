import { Router, Request, Response, RequestHandler } from 'express';
import { createCheckout } from '../../services/checkout.service';
import { PaymentRequest } from '../../types/payment';
import { prisma } from '../../config/prisma';

const router = Router();

interface WebhookBody {
  data: {
    id: string;
    external_reference: string;
    status: string;
    payment_type: string;
    payment_method: string;
  };
}

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

const handleWebhook: RequestHandler = async (req, res) => {
  try {
    const { data } = req.body as WebhookBody;
    
    if (data?.id) {
      await prisma.payment.update({
        where: { id: data.external_reference },
        data: {
          status: data.status,
          paymentId: data.id,
          paymentType: data.payment_type,
          paymentMethod: data.payment_method,
        },
      });
      
      res.status(200).json({ received: true });
    } else {
      res.status(400).json({ error: 'Invalid webhook data' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

router.post('/create', createPayment);
router.post('/webhook', handleWebhook);

export default router;