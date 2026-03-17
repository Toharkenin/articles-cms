import { Router } from 'express';
import { Subscription } from '../logic/subscription';
import { requireAdminAuth } from '../middleware/admin-auth';

const router = Router();

// Public route - anyone can subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const result = await new Subscription().subscribe(email);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.status(201).json({
      success: true,
      message: result.message,
      subscription: result.data,
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Public route - anyone can unsubscribe
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const result = await new Subscription().unsubscribe(email);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Admin route - get all subscriptions
router.get('/get-subscriptions', requireAdminAuth, async (req, res) => {
  try {
    const activeOnly = req.query.activeOnly !== 'false'; // Default to true
    const result = await new Subscription().getSubscriptions(activeOnly);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({
      success: true,
      subscriptions: result.data,
      count: result.count,
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
