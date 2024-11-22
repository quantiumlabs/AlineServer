import { v4 as uuidv4 } from 'uuid';
import { PaymentRequest } from '../types/payment';
import { prisma } from '../config/prisma';
import { preference } from '../config/mercadopago';

export const createCheckout = async (paymentData: PaymentRequest) => {
  const productId = uuidv4();
  const { amount, description, email } = paymentData;

  const webhookUrl = process.env.NODE_ENV === 'production'
    ? 'https://alinenery.com.br/api/webhook'
    : 'https://ea5f-2804-1b3-c002-cf2-19e2-92c2-71ea-8c25.ngrok-free.app/api/webhook';

  const body = {
    items: [
      {
        id: productId,
        title: description,
        quantity: 1,
        currency_id: 'BRL',
        unit_price: amount,
      },
    ],
    payer: { email },
    back_urls: {
      success: `${process.env.FRONTEND_URL}/success`,
      failure: `${process.env.FRONTEND_URL}/failure`,
      pending: `${process.env.FRONTEND_URL}/pending`,
    },
    notification_url: webhookUrl,
    external_reference: productId,
    auto_return: "approved",
  };

  try {
    const response = await preference.create({ body });

    await prisma.payment.create({
      data: {
        id: productId,
        email: paymentData.email,
        name: paymentData.name,
        phone: paymentData.phone,
        amount: paymentData.amount,
        description: paymentData.description,
        status: 'pending',
      },
    });

    return response.init_point;
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw error;
  }
};