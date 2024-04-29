import type { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { subscriptionId } = JSON.parse(req.body);
    // const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // List the first 1 subscription from Stripe account
    const subscriptions = await stripe.subscriptions.list({
      limit: 1,
    });

    // Check if there is at least one subscription
    if (subscriptions.data.length > 0) {
      const firstSubscription = subscriptions.data[0];
      // You can now return this firstSubscription, or process it as needed
      res.status(200).json({ firstSubscription });
    } else {
      // No subscriptions were found
      console.log("No subscriptions found.");
      res.status(500).json({});
    }
  } catch (error) {
    // Handle the error appropriately
    console.error("Error retrieving subscriptions: ", error);
    res.status(500).json({});
  }
}
