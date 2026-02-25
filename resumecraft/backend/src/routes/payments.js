const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const PRICES = {
  pdf_export: 2900,        // ₹29
  premium_template: 3900,  // ₹39
  cover_letter: 1900,      // ₹19
  ai_bundle: 4900,         // ₹49
  ai_pack: 900             // ₹9
};

const PRICE_LABELS = {
  pdf_export: 'PDF Export (No Watermark)',
  premium_template: 'Premium Template Export',
  cover_letter: 'Cover Letter Generation',
  ai_bundle: 'AI Full Bundle',
  ai_pack: '50 Extra AI Messages'
};

// Create payment order
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { actionType, resumeId } = req.body;
    const amount = PRICES[actionType];

    if (!amount) return res.status(400).json({ error: 'Invalid action type' });

    // Check if already paid
    if (resumeId && actionType !== 'ai_pack') {
      const existing = await global.prisma.payment.findFirst({
        where: { userId: req.user.id, resumeId, actionType, status: 'success' }
      });
      if (existing) return res.status(400).json({ error: 'Already paid for this action' });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user.id,
        resumeId: resumeId || '',
        actionType
      }
    });

    // Save pending payment
    await global.prisma.payment.create({
      data: {
        userId: req.user.id,
        resumeId: resumeId || null,
        amount,
        razorpayOrderId: order.id,
        actionType,
        status: 'pending'
      }
    });

    res.json({
      orderId: order.id,
      amount,
      currency: 'INR',
      label: PRICE_LABELS[actionType],
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Verify payment (called by frontend after Razorpay success)
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update payment status
    const payment = await global.prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: { razorpayPaymentId: razorpay_payment_id, status: 'success' }
    });

    // If ai_pack, add 50 messages to user
    if (payment.actionType === 'ai_pack') {
      await global.prisma.user.update({
        where: { id: req.user.id },
        data: { aiMessages: { increment: 50 } }
      });
    }

    // If resume export, update resume status to paid
    if (payment.resumeId) {
      await global.prisma.resume.update({
        where: { id: payment.resumeId },
        data: { status: 'paid' }
      });
    }

    res.json({ success: true, paymentId: payment.id, actionType: payment.actionType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Razorpay webhook (backup verification)
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = JSON.parse(body);

    if (event.event === 'payment.captured') {
      const orderId = event.payload.payment.entity.order_id;
      const paymentId = event.payload.payment.entity.id;

      await global.prisma.payment.updateMany({
        where: { razorpayOrderId: orderId },
        data: { razorpayPaymentId: paymentId, status: 'success' }
      });
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Payment history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const payments = await global.prisma.payment.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// Check if paid for specific action on resume
router.get('/check/:resumeId/:actionType', authMiddleware, async (req, res) => {
  try {
    const payment = await global.prisma.payment.findFirst({
      where: {
        userId: req.user.id,
        resumeId: req.params.resumeId,
        actionType: req.params.actionType,
        status: 'success'
      }
    });
    res.json({ paid: !!payment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check payment' });
  }
});

module.exports = router;
