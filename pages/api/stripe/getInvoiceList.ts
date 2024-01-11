import type { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    
  const {customerId } = JSON.parse(req.body);
  console.log(customerId);
  const invoices = await stripe.invoices.list({customer: customerId, limit: 10});

  res.status(200).json({ invoices });
}
