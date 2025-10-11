// components/PaymentSection.tsx
"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from "@stripe/react-stripe-js";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentSectionProps {
  orderTotal: number;
  orderItems: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }>;
}

export function PaymentSection({ orderTotal, orderItems }: PaymentSectionProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Payment Details</h3>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-xl font-bold">₹{orderTotal}</p>
        </div>
      </div>
      
      {/* Payment Methods */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="text-blue-600"
          />
          <div>
            <span className="font-medium">Credit/Debit Card</span>
            <div className="flex space-x-2 mt-1">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Visa</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">MasterCard</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Rupay</span>
            </div>
          </div>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
          <input
            type="radio"
            name="payment"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="text-blue-600"
          />
          <div>
            <span className="font-medium">UPI Payment</span>
            <div className="flex space-x-2 mt-1">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">GPay</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">PhonePe</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Paytm</span>
            </div>
          </div>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="text-blue-600"
          />
          <div>
            <span className="font-medium">Cash on Delivery</span>
            <p className="text-sm text-gray-600 mt-1">Pay when you receive your order</p>
          </div>
        </label>
      </div>

      {/* Stripe Card Payment */}
      {paymentMethod === "card" && (
        <Elements stripe={stripePromise}>
          <StripeCardForm 
            amount={orderTotal * 100} // Convert to paisa
            orderItems={orderItems}
          />
        </Elements>
      )}

      {/* UPI Payment */}
      {paymentMethod === "upi" && (
        <UPIPaymentForm 
          amount={orderTotal * 100}
          orderItems={orderItems}
        />
      )}

      {/* COD Confirmation */}
      {paymentMethod === "cod" && (
        <CODPayment 
          amount={orderTotal}
          orderItems={orderItems}
        />
      )}
    </div>
  );
}

// Stripe Card Payment Form
function StripeCardForm({ amount, orderItems }: { amount: number; orderItems: any[] }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError("Payment system not ready. Please try again.");
      return;
    }

    setProcessing(true);
    setError("");

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found");
      setProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        return;
      }

      // Send payment to your backend API
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: amount,
          currency: 'inr',
          orderItems: orderItems
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Payment processing failed");
        return;
      }

      if (!result.success) {
        setError(result.error || "Payment failed");
        return;
      }

      // Confirm payment with the client secret
      const { error: confirmError } = await stripe.confirmCardPayment(result.client_secret);

      if (confirmError) {
        setError(confirmError.message || "Payment confirmation failed");
      } else {
        // Payment successful - create order in your backend
        await createOrder('card');
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const createOrder = async (paymentMethod: string) => {
    try {
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderItems,
          totalAmount: amount / 100, // Convert back to rupees
          paymentMethod: paymentMethod,
          status: 'confirmed'
        }),
      });

      if (orderResponse.ok) {
        const order = await orderResponse.json();
        alert("Payment successful! Order confirmed.");
        window.location.href = `/order-confirmation?id=${order.id}`;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      alert("Payment successful but order creation failed. Please contact support.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
                padding: '10px',
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-400 font-medium hover:bg-blue-700 transition-colors"
      >
        {processing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing Payment...</span>
          </div>
        ) : (
          `Pay ₹${(amount / 100).toFixed(2)}`
        )}
      </button>

      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <span>🔒</span>
          <span>Secure SSL Encrypted Payment</span>
        </div>
      </div>
    </form>
  );
}

// UPI Payment Form
function UPIPaymentForm({ amount, orderItems }: { amount: number; orderItems: any[] }) {
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleUPIPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Validate UPI ID
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(upiId)) {
      alert("Please enter a valid UPI ID (e.g., username@paytm)");
      setProcessing(false);
      return;
    }

    try {
      // Create order with UPI payment method
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderItems,
          totalAmount: amount / 100,
          paymentMethod: 'upi',
          upiId: upiId,
          status: 'pending_payment'
        }),
      });

      if (orderResponse.ok) {
        const order = await orderResponse.json();
        alert("UPI payment initiated! Please complete the payment in your UPI app.");
        window.location.href = `/order-confirmation?id=${order.id}&method=upi`;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('UPI payment error:', error);
      alert("UPI payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleUPIPayment} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          UPI ID
        </label>
        <input
          type="text"
          placeholder="username@paytm"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter your UPI ID (e.g., username@paytm, username@ybl, username@oksbi)
        </p>
      </div>

      <button
        type="submit"
        disabled={processing}
        className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-400 font-medium hover:bg-blue-700 transition-colors"
      >
        {processing ? "Processing..." : `Pay ₹${(amount / 100).toFixed(2)} with UPI`}
      </button>
    </form>
  );
}

// COD Payment
function CODPayment({ amount, orderItems }: { amount: number; orderItems: any[] }) {
  const [processing, setProcessing] = useState(false);

  const handleCODPayment = async () => {
    setProcessing(true);
    
    try {
      // Create COD order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderItems,
          totalAmount: amount,
          paymentMethod: 'cod',
          status: 'confirmed'
        }),
      });

      if (orderResponse.ok) {
        const order = await orderResponse.json();
        alert(`Order placed successfully! You'll pay ₹${amount} when you receive your order.`);
        window.location.href = `/order-confirmation?id=${order.id}&method=cod`;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('COD order error:', error);
      alert("Failed to place order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-yellow-600 text-sm">💡</span>
          </div>
          <div>
            <p className="text-yellow-800 font-medium">Cash on Delivery Available</p>
            <p className="text-yellow-700 text-sm mt-1">
              Pay ₹{amount} when you receive your order. 
              Additional ₹30 delivery charges may apply.
              You can inspect the product before payment.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleCODPayment}
        disabled={processing}
        className="w-full bg-green-600 text-white py-3 rounded-lg disabled:bg-gray-400 font-medium hover:bg-green-700 transition-colors"
      >
        {processing ? "Placing Order..." : "Place Order (Cash on Delivery)"}
      </button>
    </div>
  );
}