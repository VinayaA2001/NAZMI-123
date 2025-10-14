// components/Newsletter.tsx
"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call your API here
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      // For demo purposes, we'll assume success
      setSubscribed(true);
      setEmail("");
      
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 text-center shadow-lg">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-3">Welcome to the Nazmi Family! 🌸</h3>
        <p className="text-green-600 mb-4">
          Thank you for subscribing! You're now part of our exclusive fashion community.
        </p>
        <div className="bg-white rounded-lg p-4 border border-green-100">
          <p className="text-sm text-green-700">
            <strong>What's Next?</strong><br/>
            • First look at new collections<br/>
            • Members-only discounts (up to 30% OFF)<br/>
            • Style tips & fashion guides<br/>
            • Early access to sales
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-8 shadow-lg">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-lg">N</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Join the Nazmi Boutique Family
        </h3>
        <p className="text-gray-600 mb-1">
          Founded with passion for authentic traditional fashion
        </p>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-500 mb-4">
          <span>🏪 Since 2024</span>
          <span>⭐ 4.9/5 Rating</span>
          <span>🚚 Free Shipping</span>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-sm">🎁</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Welcome Offer</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-sm">⭐</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Exclusive Access</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 text-sm">👑</span>
          </div>
          <span className="text-sm font-medium text-gray-700">VIP Treatment</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-600 text-sm">💎</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Style Guides</span>
        </div>
      </div>

      {/* Subscription Form */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3 text-lg">Get Fashion Updates</h4>
        <p className="text-gray-600 mb-4 text-sm">
          Subscribe to receive exclusive offers, new collection alerts, style tips, and invitations to private sales.
        </p>
        
        <form onSubmit={handleSubscribe} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="nazmiboutique1@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-medium min-w-[120px] flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Subscribe"
              )}
            </button>
          </div>
        </form>
        
        {/* Trust Signals */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>🔒 No Spam</span>
              <span>📧 1-2 emails/week</span>
            </div>
            <span>✨ Unsubscribe anytime</span>
          </div>
        </div>
      </div>

      {/* Brand Promise */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          <strong>Nazmi Boutique Promise:</strong> Premium quality • Authentic craftsmanship • Customer-first approach
        </p>
      </div>
    </div>
  );
}