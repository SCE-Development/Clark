import React, { useState } from 'react';
import config from '../../config/config.json';

const MIN_AMOUNT = 20;

export default function CashPaymentsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [messageIsError, setMessageIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const parsedAmount = parseFloat(amount);
  const isValidName = name.trim().length > 0;
  const isValidEmail = email.trim().length > 0;
  const isValidAmount = !Number.isNaN(parsedAmount) && parsedAmount >= MIN_AMOUNT;
  const canSubmit = isValidName && isValidEmail && isValidAmount;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit || submitting) {
      return;
    }

    const payload = {
      payerName: name,
      payerEmail: email,
      amount: parsedAmount,
      note: `SCE Membership: ${email}`,
      transactionId: 'N/A - cash payment',
    };

    setSubmitting(true);
    setMessage('');
    setMessageIsError(false);

    try {
      const response = await fetch('/api/MembershipPayment/storePayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.MEMBERSHIP_PAYMENT_API_KEY,
        },
        body: JSON.stringify(payload),
      });
      const responseMessage = await response.text();
      setMessage(responseMessage);
      setMessageIsError(!response.ok);
    } catch {
      setMessage('Failed to submit payment.');
      setMessageIsError(true);
    } finally {
      setSubmitting(false);
    }
  }

  function maybeRenderAmountError() {
    if (amount === '') {
      return null;
    }
    if (Number.isNaN(parsedAmount)) {
      return <p className="text-red-500">Please enter a valid number</p>;
    }
    if (parsedAmount < MIN_AMOUNT) {
      return (
        <p className="text-red-500">
          Amount must be at least ${MIN_AMOUNT.toFixed(2)}
        </p>
      );
    }
  }

  return (
    <div className="m-10">
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Cash Payments
      </h1>
      <form className="relative overflow-x-auto" onSubmit={handleSubmit}>
        <div className="py-6">
          <label className="w-full form-control">
            <div className="label">
              <span className="label-text text-md">Name</span>
            </div>
            <input
              className="w-full text-sm input input-bordered sm:text-base"
              type="text"
              placeholder="Payer name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
        </div>
        <div className="py-6">
          <label className="w-full form-control">
            <div className="label">
              <span className="label-text text-md">Email</span>
            </div>
            <input
              className="w-full text-sm input input-bordered sm:text-base"
              type="email"
              placeholder="Payer email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        </div>
        <div className="py-6">
          <label className="w-full form-control">
            <div className="label">
              <span className="label-text text-md">
                Amount (minimum ${MIN_AMOUNT.toFixed(2)})
              </span>
            </div>
            <input
              className="w-full text-sm input input-bordered sm:text-base"
              type="number"
              min={MIN_AMOUNT}
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            {maybeRenderAmountError()}
          </label>
        </div>
        <button
          type="submit"
          className="text-sm btn btn-primary sm:text-base"
          disabled={!canSubmit || submitting}
        >
          Submit Payment
        </button>
        {message && (
          <p className={`mt-4 ${messageIsError ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
