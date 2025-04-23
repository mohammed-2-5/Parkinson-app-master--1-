const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe requires the amount in cents
      currency: "usd",
    });
    return paymentIntent;
  } catch (error) {
    throw new Error("Payment creation failed: " + error.message);
  }
};

module.exports = { createPaymentIntent };
