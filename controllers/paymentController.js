const stripe = require("../config/stripe");
const Payment = require("../models/payment");
const mongoose = require("mongoose");

const createCheckoutSession = async (req, res) => {
  try {
    const {
      userId,
      doctorId,
      appointmentId,
      amount,
      currency = "usd",
    } = req.body;

    // التأكد من أن الـ userId, doctorId, appointmentId من نوع ObjectId
    const userObjectId = mongoose.Types.ObjectId(userId).toString(); // تحويل الـ ObjectId إلى string
    const doctorObjectId = mongoose.Types.ObjectId(doctorId).toString(); // تحويل الـ ObjectId إلى string
    const appointmentObjectId =
      mongoose.Types.ObjectId(appointmentId).toString(); // تحويل الـ ObjectId إلى string

    // إنشاء الجلسة في Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // نوع الدفع
      mode: "payment", // وضع الدفع
      line_items: [
        {
          price_data: {
            currency, // العملة
            product_data: {
              name: "Parkinson Doctor Consultation", // اسم المنتج
            },
            unit_amount: Math.round(Number(amount) * 100), // المبلغ بالسنتات
          },
          quantity: 1, // الكمية
        },
      ],
      metadata: {
        userId: userObjectId,
        doctorId: doctorObjectId,
        appointmentId: appointmentObjectId,
      }, // إضافة metadata للمستخدم
      success_url: "http://localhost:3000/success", // URL النجاح
      cancel_url: "http://localhost:3000/cancel", // URL الفشل
    });

    // التأكد من أن الـ payment_intent موجود
    const stripePaymentIntentId = session.payment_intent;

    // هنا هتضيف الكود الخاص بحفظ الدفع في قاعدة البيانات
    const paymentData = {
      userId: userObjectId, // تحويل الـ userId إلى string
      doctorId: doctorObjectId, // تحويل الـ doctorId إلى string
      appointmentId: appointmentObjectId, // تحويل الـ appointmentId إلى string
      amount, // المبلغ
      currency, // العملة
      status: "Pending", // حالة الدفع في البداية
      stripePaymentIntentId, // إضافة الـ PaymentIntent ID
      paidAt: null, // قيمة مدفوعة
    };

    // حفظ البيانات في قاعدة البيانات
    const payment = await Payment.create(paymentData);

    // إرجاع الـ session id و الـ payment_intentId لواجهة المستخدم
    res.status(200).json({
      id: session.id,
      url: session.url,
      stripePaymentIntentId: stripePaymentIntentId, // إرجاع الـ PaymentIntent ID
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating Stripe session",
      error: error.message,
    });
  }
};

const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET // ده هتجيبيه من Stripe Dashboard
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // سجل الدفع عند نجاح الـ checkout
      await Payment.create({
        userId: session.metadata.userId, // المستخدم
        doctorId: session.metadata.doctorId, // الطبيب
        appointmentId: session.metadata.appointmentId, // موعد الطبيب
        amount: session.amount_total / 100, // المبلغ المحول من سنتات إلى عملة
        currency: session.currency, // العملة
        stripePaymentIntentId: session.payment_intent, // PaymentIntent ID
        status: "Paid", // حالة الدفع
        paidAt: new Date(), // تاريخ الدفع
      });
    }

    res.status(200).json({ received: true });
  } catch (err) {
    res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
};

module.exports = {
  createCheckoutSession,
  stripeWebhook,
};
