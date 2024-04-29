import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { customerId, paymentMethodId } = JSON.parse(req.body);

    // Retrieve the customer to get the default payment method for invoices

    const customer = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Default payment method updated successfully",
      customer: customer,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}
