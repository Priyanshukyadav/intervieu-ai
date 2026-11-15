import mongoose from "mongoose";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import stripe from "../services/stripe.service.js";

const plans = {
  basic: { name: "Starter Pack", amount: 100, credits: 150 },
  pro: { name: "Pro Pack", amount: 500, credits: 650 },
};

const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

export const createOrder = async (req,res) => {
    try {
      const { planId } = req.body || {};
      const plan = Object.prototype.hasOwnProperty.call(plans, planId) ? plans[planId] : null;
      if (!plan) {
        return res.status(400).json({ message: "Invalid plan." });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: plan.name,
                description: `${plan.credits} InterviewIQ AI credits`,
              },
              unit_amount: plan.amount * 100,
            },
            quantity: 1,
          },
        ],
        success_url: `${clientUrl}/pricing?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientUrl}/pricing?payment=cancelled`,
        metadata: {
          userId: String(req.userId),
          planId,
        },
      });

      await Payment.create({
        userId: req.userId,
        planId,
        amount: plan.amount,
        credits: plan.credits,
        stripeCheckoutSessionId: checkoutSession.id,
        status: "created",
      });

      return res.json({ id: checkoutSession.id, url: checkoutSession.url });
    } catch (error) {
      console.error("Stripe Checkout session creation failed:", error);
      return res.status(500).json({ message: "Unable to create Stripe Checkout session." });
    }
}


export const verifyPayment = async (req,res) => {
    try {
      const { sessionId } = req.body || {};
      if (typeof sessionId !== "string" || !sessionId) {
        return res.status(400).json({ message: "Missing Stripe Checkout session ID." });
      }

      const payment = await Payment.findOne({
        stripeCheckoutSessionId: sessionId,
        userId: req.userId,
      });

      if (!payment) {
        return res.status(404).json({ message: "Payment not found." });
      }

      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      if (
        checkoutSession.metadata?.userId !== String(req.userId) ||
        checkoutSession.payment_status !== "paid" ||
        checkoutSession.currency !== "inr" ||
        checkoutSession.amount_total !== payment.amount * 100
      ) {
        return res.status(400).json({ message: "Stripe payment is not complete or does not match this order." });
      }

      const stripePaymentIntentId =
        typeof checkoutSession.payment_intent === "string"
          ? checkoutSession.payment_intent
          : checkoutSession.payment_intent?.id;
      const dbSession = await mongoose.startSession();
      let updatedUser;

      try {
        await dbSession.withTransaction(async () => {
          const paidPayment = await Payment.findOneAndUpdate(
            { _id: payment._id, status: "created" },
            {
              $set: {
                status: "paid",
                stripePaymentIntentId,
              },
            },
            { new: true, session: dbSession }
          );

          if (paidPayment) {
            updatedUser = await User.findByIdAndUpdate(
              payment.userId,
              { $inc: { credits: payment.credits } },
              { new: true, session: dbSession }
            );
          } else {
            updatedUser = await User.findById(payment.userId).session(dbSession);
          }

          if (!updatedUser) {
            throw new Error("User for paid Stripe order was not found.");
          }
        });
      } finally {
        await dbSession.endSession();
      }

      return res.json({
        success: true,
        message: "Payment verified and credits added.",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Stripe payment verification failed:", error);
      return res.status(500).json({ message: "Unable to verify Stripe payment." });
    }
}