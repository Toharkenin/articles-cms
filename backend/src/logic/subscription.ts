import SubscriptionModel from '../models/subscription';

export class Subscription {
  async subscribe(email: string) {
    try {
      // Check if email already exists
      const existingSubscription = await SubscriptionModel.findOne({ email });

      if (existingSubscription) {
        // If already subscribed and active
        if (existingSubscription.isActive) {
          return {
            success: false,
            message: 'Email is already subscribed',
          };
        }

        // If previously unsubscribed, reactivate
        existingSubscription.isActive = true;
        existingSubscription.subscribedAt = new Date();
        existingSubscription.unsubscribedAt = undefined;
        await existingSubscription.save();

        return {
          success: true,
          message: 'Successfully resubscribed',
          data: existingSubscription,
        };
      }

      // Create new subscription
      const newSubscription = new SubscriptionModel({
        email,
        isActive: true,
        subscribedAt: new Date(),
      });

      await newSubscription.save();

      return {
        success: true,
        message: 'Successfully subscribed',
        data: newSubscription,
      };
    } catch (error) {
      console.error('Subscribe error:', error);
      return {
        success: false,
        message: 'An error occurred while subscribing',
      };
    }
  }

  async unsubscribe(email: string) {
    try {
      const subscription = await SubscriptionModel.findOne({ email });

      if (!subscription) {
        return {
          success: false,
          message: 'Email not found',
        };
      }

      if (!subscription.isActive) {
        return {
          success: false,
          message: 'Email is already unsubscribed',
        };
      }

      subscription.isActive = false;
      subscription.unsubscribedAt = new Date();
      await subscription.save();

      return {
        success: true,
        message: 'Successfully unsubscribed',
        data: subscription,
      };
    } catch (error) {
      console.error('Unsubscribe error:', error);
      return {
        success: false,
        message: 'An error occurred while unsubscribing',
      };
    }
  }

  async getSubscriptions(activeOnly: boolean = true) {
    try {
      const filter = activeOnly ? { isActive: true } : {};
      const subscriptions = await SubscriptionModel.find(filter).sort({ subscribedAt: -1 });

      return {
        success: true,
        data: subscriptions,
        count: subscriptions.length,
      };
    } catch (error) {
      console.error('Get subscriptions error:', error);
      return {
        success: false,
        message: 'An error occurred while fetching subscriptions',
      };
    }
  }
}
