'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { subscribe } from '@/services/subscription';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await subscribe(email);
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="newsletter-section py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-3 text-theme-dark">Stay Informed</h2>
        <p className="text-lg mb-8 text-gray-600">
          Get the latest geopolitical analysis and insights delivered to your inbox weekly.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className=" flex-1 px-4 py-3 rounded-lg text-gray-900 border-2 border-gray-500"
              disabled={status === 'loading'}
            />
            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>

          {status === 'success' && (
            <p className="mt-4 text-green-700 font-medium text-sm">
              Successfully subscribed! Check your email.
            </p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-red-700 font-medium text-sm">
              Something went wrong. Please try again.
            </p>
          )}
        </form>

        <p className="mt-6 text-sm text-gray-500">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
