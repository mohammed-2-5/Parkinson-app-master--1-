const Stripe = require("stripe");
module.exports = new Stripe(process.env.STRIPE_SECRET_KEY); // لازم تحطي sk_test_xxx هنا في .env
