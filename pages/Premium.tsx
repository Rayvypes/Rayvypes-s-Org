
import React, { useState, useEffect } from 'react';
import { SubscriptionType } from '../types';

interface PremiumProps {
  currentSubscription: SubscriptionType;
  onSubscribe: (type: SubscriptionType, txRef: string) => void;
}

const Premium: React.FC<PremiumProps> = ({ currentSubscription, onSubscribe }) => {
  const [activeCheckoutPlan, setActiveCheckoutPlan] = useState<SubscriptionType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'airtel'>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalCountdown, setApprovalCountdown] = useState(15);

  const plans = [
    {
      id: 'weekly' as SubscriptionType,
      name: 'Weekly Pass',
      price: '3,000',
      duration: '7 Days',
      description: 'Perfect for a movie marathon week.',
      features: ['Full HD Streaming', 'VJ Translated Movies', 'Ad-free Experience', 'Mobile & Web access'],
      highlight: false
    },
    {
      id: 'monthly' as SubscriptionType,
      name: 'Monthly Pro',
      price: '5,000',
      duration: '30 Days',
      description: 'Our most popular plan for cinema lovers.',
      features: ['All Weekly features', 'Offline Downloads', 'Early Access to Premiers', 'Priority AI Curation'],
      highlight: true
    },
    {
      id: 'yearly' as SubscriptionType,
      name: 'Yearly Legend',
      price: '6,000',
      duration: '365 Days',
      description: 'Unbeatable value for the ultimate fan.',
      features: ['All Monthly features', 'Exclusive Merch Access', 'CinePrime Festival Invites', 'Lifetime Profile Badge'],
      highlight: false
    }
  ];

  const currentPlanData = plans.find(p => p.id === activeCheckoutPlan);

  const handleInitiatePayment = () => {
    if (phoneNumber.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsProcessing(true);
    // Simulating the delay for the Mobile Money 'Push' Request
    setTimeout(() => {
      setIsProcessing(false);
      setShowApprovalModal(true);
      setApprovalCountdown(15);
    }, 1500);
  };

  useEffect(() => {
    let timer: number;
    if (showApprovalModal && approvalCountdown > 0) {
      timer = window.setInterval(() => {
        setApprovalCountdown(prev => prev - 1);
      }, 1000);
    } else if (showApprovalModal && approvalCountdown === 0) {
      handlePaymentSuccess();
    }
    return () => clearInterval(timer);
  }, [showApprovalModal, approvalCountdown]);

  const handlePaymentSuccess = () => {
    const generatedRef = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    onSubscribe(activeCheckoutPlan!, generatedRef);
    setShowApprovalModal(false);
    setActiveCheckoutPlan(null);
    setPhoneNumber('');
    alert(`Success! Transaction ${generatedRef} confirmed.`);
  };

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      {/* Payment Approval Modal */}
      {showApprovalModal && currentPlanData && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#1a1d23] border border-white/5 rounded-[3rem] p-10 text-center shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-2 ${paymentMethod === 'mtn' ? 'bg-yellow-400' : 'bg-red-600'}`}></div>
            <div className="mb-8">
              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 animate-bounce ${paymentMethod === 'mtn' ? 'bg-yellow-400' : 'bg-red-600'}`}>
                <svg className={`w-10 h-10 ${paymentMethod === 'mtn' ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="text-white text-2xl font-black uppercase tracking-tighter italic mb-2">Check Your Phone</h2>
              <p className="text-gray-400 text-sm">Follow instructions on your handset to approve UGX {currentPlanData.price}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-8">
              <p className="text-yellow-400 text-[10px] font-black uppercase tracking-widest animate-pulse">Awaiting PIN Entry...</p>
            </div>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Processing Session: {approvalCountdown}s</p>
          </div>
        </div>
      )}

      {/* Plans Selection */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-montserrat font-black text-white mb-6 uppercase tracking-tighter">
          Unlock the <span className="text-yellow-400 italic">Pearl</span> Experience
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Support local creators. Unlimited access to VJ Junior, VJ Emmy, and original Ugandan productions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className={`relative rounded-[2.5rem] p-10 border transition-all duration-500 ${plan.highlight ? 'bg-gradient-to-b from-yellow-400/10 to-[#1a1d23] border-yellow-400/50 scale-105 z-10' : 'bg-[#1a1d23] border-white/5'}`}>
            <h3 className="text-white font-montserrat font-black text-2xl uppercase mb-6">{plan.name}</h3>
            <div className="mb-10">
              <span className="text-white text-5xl font-black italic">UGX {plan.price}</span>
              <span className="text-gray-500 text-sm font-bold block mt-2 uppercase">/ {plan.duration}</span>
            </div>
            <ul className="space-y-4 mb-10">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setActiveCheckoutPlan(plan.id)}
              disabled={currentSubscription === plan.id}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${currentSubscription === plan.id ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-yellow-400 text-black hover:bg-yellow-300'}`}
            >
              {currentSubscription === plan.id ? 'ACTIVE' : 'CHOOSE PLAN'}
            </button>
          </div>
        ))}
      </div>

      {/* Simple Checkout Overlay */}
      {activeCheckoutPlan && !showApprovalModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
          <div className="w-full max-w-lg bg-[#1a1d23] rounded-[3rem] p-10 border border-white/10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-white font-black text-2xl uppercase italic">Mobile Checkout</h2>
              <button onClick={() => setActiveCheckoutPlan(null)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setPaymentMethod('mtn')} className={`p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'mtn' ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' : 'border-white/5'}`}>MTN MoMo</button>
                <button onClick={() => setPaymentMethod('airtel')} className={`p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'airtel' ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-white/5'}`}>Airtel Money</button>
              </div>
              <input type="tel" maxLength={10} placeholder="Enter MoMo Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white font-mono text-xl focus:ring-2 focus:ring-yellow-400 outline-none" />
              <button onClick={handleInitiatePayment} disabled={phoneNumber.length < 10 || isProcessing} className="w-full bg-yellow-400 text-black py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-yellow-400/20 active:scale-95 disabled:opacity-50 transition-all">
                {isProcessing ? 'INITIATING...' : `PAY UGX ${currentPlanData?.price}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Premium;
