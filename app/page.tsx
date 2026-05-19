"use client";

import { useMemo, useRef, useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  BadgeCheck,
  Lock,
  Sparkles,
  ArrowRight,
  Loader2,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  const eligibilityRef = useRef<HTMLDivElement | null>(null);
  const feesRef = useRef<HTMLDivElement | null>(null);

  const [loadingPayment, setLoadingPayment] = useState(false);

  const [showEligiblePopup, setShowEligiblePopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [paymentPhone, setPaymentPhone] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    day: "11",
    month: "November",
    year: "1998",
    phone: "",
    employment: "Employed (full-time)",
    limit: "Up to 10,000",
    consent: true,
  });

  const limits = [
    {
      name: "Up to 10,000",
      fee: 200,
      qualify: 8500,
    },
    {
      name: "10,001 – 30,000",
      fee: 300,
      qualify: 24000,
    },
    {
      name: "30,001 – 50,000",
      fee: 400,
      qualify: 42000,
    },
    {
      name: "50,001 – 69,999",
      fee: 800,
      qualify: 65000,
    },
    {
      name: "70,000 (maximum limit)",
      fee: 1200,
      qualify: 70000,
    },
  ];

  const selectedPlan = useMemo(() => {
    return limits.find((l) => l.name === form.limit);
  }, [form.limit]);

  const scrollToForm = () => {
    eligibilityRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToFees = () => {
    feesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* ----------------------------------
     FORMAT PHONE
  -----------------------------------*/
  const formatPhone = (phone: string) => {
    let cleaned = phone.replace(/\D/g, "");

    // 07XXXXXXXX
    if (cleaned.startsWith("07")) {
      cleaned = "254" + cleaned.slice(1);
    }

    // 01XXXXXXXX
    else if (cleaned.startsWith("01")) {
      cleaned = "254" + cleaned.slice(1);
    }

    // 7XXXXXXXX
    else if (
      cleaned.startsWith("7") &&
      cleaned.length === 9
    ) {
      cleaned = "254" + cleaned;
    }

    // 1XXXXXXXX
    else if (
      cleaned.startsWith("1") &&
      cleaned.length === 9
    ) {
      cleaned = "254" + cleaned;
    }

    // already 254
    else if (cleaned.startsWith("254")) {
      cleaned = cleaned;
    }

    return cleaned;
  };

  /* ----------------------------------
     VALIDATE PHONE
  -----------------------------------*/
  const isValidPhone = (phone: string) => {
    const cleaned = formatPhone(phone);

    return /^254(7|1)\d{8}$/.test(cleaned);
  };

  /* ----------------------------------
     SUBMIT
  -----------------------------------*/
  const handleSubmit = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.idNumber ||
      !form.phone
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!form.consent) {
      alert("Please accept the consent policy.");
      return;
    }

    if (!isValidPhone(form.phone)) {
      alert(
        "Please enter a valid Safaricom number."
      );
      return;
    }

    setPaymentPhone(form.phone);
    setShowEligiblePopup(true);
  };

  /* ----------------------------------
     PAYMENT
  -----------------------------------*/
  const handlePayment = async () => {
    try {
      if (!isValidPhone(paymentPhone)) {
        alert("Enter a valid M-Pesa number.");
        return;
      }

      setLoadingPayment(true);

      const formattedPhone =
        formatPhone(paymentPhone);

      const response = await fetch(
        "https://starlink-backend-yb3n.onrender.com/api/runPrompt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            phone: formattedPhone,
            amount: selectedPlan?.fee,
            local_id:
              "LB-" +
              Date.now().toString().slice(-8),
            transaction_desc:
              "LimitBoost Service Fee",
            till_id: "1",
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      /* ----------------------------------
         ONLY SUCCESS IF PAYMENT SUCCESSFUL
      -----------------------------------*/
      if (
        response.ok &&
        data?.status === true
      ) {
        setShowPaymentPopup(false);

        setTimeout(() => {
          setShowSuccess(true);
        }, 1000);
      } else {
        alert(
          data?.msg ||
            "STK Push failed. Please try again."
        );
      }
    } catch (error: any) {
      console.log(error);

      alert(
        "Payment request failed. Please try again."
      );
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          background: #f6faf7;
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }

        .input {
          width: 100%;
          height: 58px;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          background: #fafafa;
          padding-left: 18px;
          padding-right: 18px;
          font-size: 15px;
          outline: none;
          transition: 0.25s ease;
          color: #111827;
          font-weight: 500;
        }

        .input::placeholder {
          color: #9ca3af;
          font-weight: 500;
        }

        .input:focus {
          border-color: #08b13d;
          box-shadow: 0 0 0 5px #dcfce7;
          background: white;
        }

        .glass {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(18px);
        }

        .hero-glow {
          position: absolute;
          width: 420px;
          height: 420px;
          background: #08b13d;
          filter: blur(120px);
          opacity: 0.12;
          border-radius: 999px;
          z-index: 0;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>

      <main className="min-h-screen overflow-hidden bg-[#f6faf7] relative">
        {/* GLOW */}
        <div className="hero-glow top-[-120px] left-[-100px]" />

        {/* HEADER */}
        <header className="sticky top-0 z-50 glass border-b border-white/60">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-[78px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#08b13d] text-white flex items-center justify-center font-black text-lg shadow-xl shadow-green-300">
                L
              </div>

              <div>
                <h1 className="font-black text-[24px] leading-none tracking-tight text-[#111]">
                  LimitBoost
                </h1>

                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  In partnership with Safaricom &
                  M-Shwari
                </p>
              </div>
            </div>

            <button
              onClick={scrollToForm}
              className="hidden md:flex h-11 px-5 items-center rounded-full bg-[#08b13d] text-white font-bold text-sm shadow-xl shadow-green-200 hover:scale-[1.03] duration-300"
            >
              Check Eligibility
            </button>
          </div>
        </header>

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 relative z-10">
          <div className="grid lg:grid-cols-[1fr_500px] gap-10 items-start">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-[#089134] px-4 py-2 rounded-full font-semibold text-xs md:text-sm border border-green-200">
                <CheckCircle2 className="w-4 h-4" />
                Verified by Safaricom & NCBA
              </div>

              <h2 className="text-[44px] sm:text-[62px] md:text-[82px] leading-[0.92] font-black mt-6 text-[#0b0b0b] tracking-[-3px]">
                Boost your
                <span className="text-[#08b13d]">
                  {" "}
                  M-Shwari{" "}
                </span>
                limit.
                <br />
                Borrow more,
                <br />
                pay less.
              </h2>

              <p className="text-gray-600 text-[15px] md:text-lg leading-8 mt-7 max-w-2xl">
                We help eligible M-Pesa customers
                unlock higher M-Shwari loan limits.
                Submit your details below to check
                eligibility — verification takes
                under 30 seconds.
              </p>

              <div className="flex flex-wrap gap-3 mt-9">
                <button
                  onClick={scrollToForm}
                  className="h-14 px-7 rounded-full bg-[#08b13d] text-white font-bold text-sm md:text-base shadow-2xl shadow-green-200 hover:scale-[1.03] duration-300"
                >
                  Start eligibility check
                </button>

                <button
                  onClick={scrollToFees}
                  className="h-14 px-7 rounded-full border border-gray-200 bg-white font-bold text-sm md:text-base hover:bg-gray-50 duration-200"
                >
                  View service fees
                </button>
              </div>

              {/* MINI CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
                <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[28px] p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="text-[#08b13d]" />

                    <span className="text-xs bg-green-100 text-[#08b13d] px-2 py-1 rounded-full font-bold">
                      LIVE
                    </span>
                  </div>

                  <h3 className="text-3xl font-black mt-5">
                    120K+
                  </h3>

                  <p className="text-gray-500 text-sm mt-2">
                    Customers boosted
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[28px] p-5 shadow-lg animate-float">
                  <div className="flex items-center justify-between">
                    <ShieldCheck className="text-[#08b13d]" />

                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">
                      FAST
                    </span>
                  </div>

                  <h3 className="text-3xl font-black mt-5">
                    ~30s
                  </h3>

                  <p className="text-gray-500 text-sm mt-2">
                    Eligibility check
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[28px] p-5 shadow-lg col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between">
                    <CreditCard className="text-[#08b13d]" />

                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold">
                      MAX
                    </span>
                  </div>

                  <h3 className="text-3xl font-black mt-5">
                    KES 70K
                  </h3>

                  <p className="text-gray-500 text-sm mt-2">
                    Highest possible limit
                  </p>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div
              ref={eligibilityRef}
              id="eligibility"
              className="bg-white/90 backdrop-blur-xl rounded-[38px] border border-white p-5 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sticky top-24"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl md:text-4xl font-black">
                    Eligibility check
                  </h3>

                  <p className="text-gray-500 text-sm md:text-base mt-2 leading-7">
                    Secure 30-second verification
                  </p>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                  <ShieldCheck className="text-[#08b13d]" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-7">
                <Input
                  label="First name *"
                  placeholder="e.g. Edwin"
                  value={form.firstName}
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      firstName: e.target.value,
                    })
                  }
                />

                <Input
                  label="Last name *"
                  placeholder="e.g. woli"
                  value={form.lastName}
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      lastName: e.target.value,
                    })
                  }
                />

                <Input
                  label="National ID number *"
                  placeholder="e.g. 34567890"
                  value={form.idNumber}
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      idNumber: e.target.value,
                    })
                  }
                />

                {/* DOB */}
                <div>
                  <label className="font-semibold text-sm">
                    Date of birth *
                  </label>

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <select
                      value={form.day}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          day: e.target.value,
                        })
                      }
                      className="input"
                    >
                      {Array.from({
                        length: 31,
                      }).map((_, i) => (
                        <option key={i}>
                          {i + 1}
                        </option>
                      ))}
                    </select>

                    <select
                      value={form.month}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          month: e.target.value,
                        })
                      }
                      className="input"
                    >
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((m) => (
                        <option key={m}>
                          {m}
                        </option>
                      ))}
                    </select>

                    <select
                      value={form.year}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          year: e.target.value,
                        })
                      }
                      className="input"
                    >
                      {Array.from({
                        length: 50,
                      }).map((_, i) => (
                        <option key={i}>
                          {2026 - i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* PHONE */}
              <div className="mt-4">
                <label className="font-semibold text-sm">
                  M-Pesa registered phone *
                </label>

                <div className="flex mt-2">
                  <div className="w-24 rounded-l-[20px] border border-r-0 bg-gray-50 flex items-center justify-center font-semibold text-sm">
                    +254
                  </div>

                  <input
                    placeholder="712345678"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                    className="input rounded-l-none"
                  />
                </div>

                <p className="text-gray-400 text-xs mt-2">
                  Accepts 07XXXXXXXX,
                  01XXXXXXXX, or 254XXXXXXXXX
                </p>
              </div>

              {/* EMPLOYMENT */}
              <div className="mt-4">
                <label className="font-semibold text-sm">
                  Employment status *
                </label>

                <select
                  value={form.employment}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      employment: e.target.value,
                    })
                  }
                  className="input mt-2"
                >
                  <option>
                    Employed (full-time)
                  </option>
                  <option>
                    Self-employed
                  </option>
                  <option>
                    Business owner
                  </option>
                  <option>Student</option>
                  <option>Freelancer</option>
                  <option>Unemployed</option>
                </select>
              </div>

              {/* LIMIT */}
              <div className="mt-4">
                <label className="font-semibold text-sm">
                  Desired limit (KES) *
                </label>

                <select
                  value={form.limit}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      limit: e.target.value,
                    })
                  }
                  className="input mt-2"
                >
                  {limits.map((limit, index) => (
                    <option key={index}>
                      {limit.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* CONSENT */}
              <div className="bg-[#f7f8f7] rounded-3xl p-4 mt-5 border border-green-100">
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        consent: e.target.checked,
                      })
                    }
                    className="mt-1 w-4 h-4 accent-green-600"
                  />

                  <p className="text-gray-600 leading-7 text-sm">
                    I confirm the details are
                    accurate and consent to
                    <span className="font-bold">
                      {" "}
                      LimitBoost{" "}
                    </span>
                    and its partners (Safaricom &
                    NCBA M-Shwari) processing my
                    data to assess eligibility.
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full h-14 rounded-full bg-[#08b13d] text-white font-black text-base mt-6 shadow-2xl shadow-green-200 hover:scale-[1.01] duration-300"
              >
                Check my eligibility
              </button>

              <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mt-5">
                <Lock className="w-4 h-4" />
                Secure submission · We never ask
                for your M-Pesa PIN
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard
              icon={<ShieldCheck />}
              title="256-bit encryption"
              desc="End-to-end secure"
            />

            <InfoCard
              icon={<BadgeCheck />}
              title="CBK-licensed"
              desc="Regulated by NCBA"
            />

            <InfoCard
              icon={<Sparkles />}
              title="30-second check"
              desc="Instant eligibility"
            />

            <InfoCard
              icon={<CreditCard />}
              title="No PIN required"
              desc="We never ask for it"
            />
          </div>
        </section>

        {/* FEES */}
        <section
          ref={feesRef}
          className="max-w-5xl mx-auto px-4 md:px-6 pb-14"
        >
          <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-3xl md:text-5xl font-black">
                Service fee schedule
              </h2>

              <p className="text-gray-500 mt-3 leading-7">
                One-time maintenance fee payable
                via M-Pesa.
              </p>
            </div>

            <button
              onClick={scrollToForm}
              className="h-12 px-5 rounded-full bg-[#08b13d] text-white font-bold shadow-lg shadow-green-200"
            >
              Apply now
            </button>
          </div>

          <div className="bg-white rounded-[32px] overflow-hidden border border-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <div className="bg-[#08b13d] text-white grid grid-cols-2 p-5 font-black text-xs md:text-lg">
              <p>DESIRED LIMIT RANGE</p>
              <p>SERVICE FEE</p>
            </div>

            {limits.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setForm({
                    ...form,
                    limit: item.name,
                  });

                  scrollToForm();
                }}
                className="grid grid-cols-2 p-5 border-t text-sm md:text-lg hover:bg-green-50 duration-200 text-left w-full"
              >
                <p>{item.name}</p>

                <p className="font-black text-[#089134]">
                  KES {item.fee}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* STEPS */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
          <h2 className="text-4xl md:text-5xl font-black text-center">
            Three simple steps
          </h2>

          <div className="grid md:grid-cols-3 gap-5 mt-10">
            <StepCard
              number="1"
              title="Share your details"
              desc="Fill in your M-Pesa registered phone number and ID details securely."
            />

            <StepCard
              number="2"
              title="We check eligibility"
              desc="Our system reviews your profile instantly and confirms your qualification."
            />

            <StepCard
              number="3"
              title="Pay fee & boost"
              desc="Complete the secure M-Pesa STK Push payment to activate your new limit."
            />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white bg-white/80 backdrop-blur-xl py-8 text-center text-gray-500 text-sm">
          © 2026 LimitBoost. All rights reserved.
        </footer>

        {/* ELIGIBLE POPUP */}
        {showEligiblePopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md rounded-[36px] p-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="text-[#08b13d] w-8 h-8" />
              </div>

              <h2 className="text-3xl font-black mt-5">
                You're eligible!
              </h2>

              <p className="text-gray-500 leading-7 mt-4 text-sm md:text-base">
                Congratulations{" "}
                <span className="font-bold text-[#111]">
                  {form.firstName}
                </span>
                , you qualify for a new M-Shwari
                loan limit of:
              </p>

              <h1 className="text-5xl font-black text-[#08b13d] mt-5">
                KES{" "}
                {selectedPlan?.qualify.toLocaleString()}
              </h1>

              <div className="bg-[#f7faf7] rounded-3xl p-4 mt-5 border">
                <div className="flex justify-between">
                  <p className="text-gray-500">
                    Service fee
                  </p>

                  <p className="font-black text-[#089134]">
                    KES {selectedPlan?.fee}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowEligiblePopup(false);
                  setShowPaymentPopup(true);
                }}
                className="w-full h-14 rounded-full bg-[#08b13d] text-white font-black mt-6 flex items-center justify-center gap-2 shadow-xl shadow-green-200"
              >
                Continue to payment
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* PAYMENT */}
        {showPaymentPopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md rounded-[36px] p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#08b13d]" />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Secure M-Pesa Payment
                  </h2>

                  <p className="text-gray-500 text-sm">
                    STK Push powered by NestLink
                  </p>
                </div>
              </div>

              <div className="bg-[#f7faf7] rounded-3xl p-5 mt-5 space-y-4 border">
                <div className="flex justify-between">
                  <p className="text-gray-500 text-sm">
                    Approved limit
                  </p>

                  <p className="font-black">
                    KES{" "}
                    {selectedPlan?.qualify.toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-500 text-sm">
                    Amount to pay
                  </p>

                  <p className="font-black text-[#089134]">
                    KES {selectedPlan?.fee}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label className="font-semibold text-sm">
                  M-Pesa mobile number *
                </label>

                <div className="flex mt-2">
                  <div className="w-24 rounded-l-[20px] border border-r-0 bg-gray-50 flex items-center justify-center font-semibold text-sm">
                    +254
                  </div>

                  <input
                    placeholder="712345678"
                    value={paymentPhone}
                    onChange={(e) =>
                      setPaymentPhone(
                        e.target.value
                      )
                    }
                    className="input rounded-l-none"
                  />
                </div>

                <p className="text-gray-400 text-xs mt-2">
                  STK Push will be sent to this
                  number.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mt-5">
                <p className="text-sm text-yellow-800 leading-6">
                  After clicking{" "}
                  <span className="font-bold">
                    “Make Payment”
                  </span>
                  , check your phone and enter
                  your M-Pesa PIN to complete the
                  transaction.
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={loadingPayment}
                className="w-full h-14 rounded-full bg-[#08b13d] text-white font-black mt-6 flex items-center justify-center gap-2 disabled:opacity-70 shadow-xl shadow-green-200"
              >
                {loadingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Waiting for payment...
                  </>
                ) : (
                  "Make Payment"
                )}
              </button>

              <button
                onClick={() => {
                  setShowPaymentPopup(false);
                  setShowEligiblePopup(true);
                }}
                className="w-full h-14 rounded-full border mt-3 font-bold"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md rounded-[36px] p-7 text-center shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="text-[#08b13d] w-10 h-10" />
              </div>

              <div className="flex items-center justify-center gap-1 mt-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <h2 className="text-4xl font-black mt-4">
                Payment Successful!
              </h2>

              <p className="text-gray-500 leading-7 mt-4">
                Your service fee payment has been
                received successfully.
              </p>

              <div className="bg-[#f7faf7] rounded-3xl p-5 mt-6 border">
                <p className="text-gray-500 text-sm">
                  Updated M-Shwari limit
                </p>

                <h1 className="text-4xl font-black text-[#08b13d] mt-3">
                  KES{" "}
                  {selectedPlan?.qualify.toLocaleString()}
                </h1>
              </div>

              <p className="text-gray-500 mt-5 leading-7 text-sm">
                Your updated limit may reflect
                within 24 hours.
              </p>

              <button
                onClick={() =>
                  setShowSuccess(false)
                }
                className="w-full h-14 rounded-full bg-[#08b13d] text-white font-black mt-6 shadow-xl shadow-green-200"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

/* INPUT */
function Input({
  label,
  placeholder,
  value,
  onChange,
}: any) {
  return (
    <div>
      <label className="font-semibold text-sm">
        {label}
      </label>

      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input mt-2"
      />
    </div>
  );
}

/* INFO CARD */
function InfoCard({
  icon,
  title,
  desc,
}: any) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[28px] border border-white p-5 shadow-lg hover:-translate-y-1 duration-300">
      <div className="w-12 h-12 rounded-2xl bg-green-100 text-[#08b13d] flex items-center justify-center">
        {icon}
      </div>

      <h3 className="font-black text-base md:text-lg mt-4">
        {title}
      </h3>

      <p className="text-gray-500 mt-2 text-sm">
        {desc}
      </p>
    </div>
  );
}

/* STEP */
function StepCard({
  number,
  title,
  desc,
}: any) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[34px] border border-white p-6 shadow-lg hover:-translate-y-1 duration-300">
      <div className="w-14 h-14 rounded-full bg-[#08b13d] text-white flex items-center justify-center text-xl font-black shadow-lg shadow-green-200">
        {number}
      </div>

      <h3 className="text-2xl font-black mt-5">
        {title}
      </h3>

      <p className="text-gray-500 leading-7 mt-3 text-sm md:text-base">
        {desc}
      </p>
    </div>
  );
}
