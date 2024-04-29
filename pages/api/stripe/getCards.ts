import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { customerId } = JSON.parse(req.body);
    
    // Retrieve the customer to get the default payment method for invoices
    const customer = await stripe.customers.retrieve(customerId);
    const defaultPaymentMethodId = customer.invoice_settings?.default_payment_method as string;

    // List the payment methods attached to the customer
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    // Map the payment methods to include card details and isDefaultCard property
    const cardDetails = paymentMethods.data.map((paymentMethod: Stripe.PaymentMethod) => {
      const isDefaultCard = paymentMethod.id === defaultPaymentMethodId;
      return {
        method: paymentMethod,
        cardType: paymentMethod.card?.brand,
        last4: paymentMethod.card?.last4,
        expMonth: paymentMethod.card?.exp_month,
        expYear: paymentMethod.card?.exp_year,
        expDate: paymentMethod.card?.exp_month?.toString().padStart(2, '0') + '/' + paymentMethod.card?.exp_year,
        isDefaultCard: isDefaultCard, // This is the new property
      };
    });

    res.status(200).json({ cardDetails });
    
  } catch (error) {
    res.status(500).json(error);
  }
}