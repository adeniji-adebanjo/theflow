"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Target,
  Users,
  Zap,
  Coins,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QUESTIONS, GET_CATEGORY, Pillar } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PILLAR_ICONS: Record<Pillar, React.ElementType> = {
  Focus: Target,
  Leadership: Users,
  Opportunity: Zap,
  Worth: Coins,
};

const PILLAR_COLORS: Record<Pillar, string> = {
  Focus: "text-blue-500 bg-blue-50 border-blue-100",
  Leadership: "text-purple-500 bg-purple-50 border-purple-100",
  Opportunity: "text-amber-500 bg-amber-50 border-amber-100",
  Worth: "text-emerald-500 bg-emerald-50 border-emerald-100",
};

export default function FlowDiagnostic() {
  const [step, setStep] = useState<"lead" | "quiz" | "results">("lead");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    business: "",
  });
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // --- Handlers ---
  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.name && userData.email) setStep("quiz");
  };

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [QUESTIONS[currentQuestionIdx].id]: parseInt(value),
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIdx(currentQuestionIdx + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      setStep("results");
    }
  };

  // --- Calculations ---
  const calculateScores = () => {
    const scores: Record<Pillar, number> = {
      Focus: 0,
      Leadership: 0,
      Opportunity: 0,
      Worth: 0,
    };
    QUESTIONS.forEach((q) => {
      scores[q.pillar] += answers[q.id] || 0;
    });
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const lowestPillar = (Object.keys(scores) as Pillar[]).reduce((a, b) =>
      scores[a] < scores[b] ? a : b,
    );

    return { scores, total, lowestPillar };
  };

  // --- Animation Variants ---
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  // --- Views ---
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center justify-center min-h-[80vh]">
      <AnimatePresence mode="wait">
        {step === "lead" && (
          <motion.div
            key="lead-step"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-xl"
          >
            <Card className="border-none shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] bg-white/80 backdrop-blur-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
              <CardHeader className="text-center pt-10">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                  <TrendingUp size={32} />
                </div>
                <CardTitle className="text-4xl font-heading font-bold tracking-tight text-slate-900">
                  The FLOW Diagnostic
                </CardTitle>
                <CardDescription className="text-lg mt-4 text-slate-600 max-w-sm mx-auto">
                  Identify the primary constraint holding your business back and
                  unlock exponential growth.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-10 px-8">
                <form onSubmit={handleLeadSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-slate-700 font-semibold"
                    >
                      Full Name
                    </Label>
                    <Input
                      required
                      id="name"
                      placeholder="John Doe"
                      className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all text-lg"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-slate-700 font-semibold"
                    >
                      Email Address
                    </Label>
                    <Input
                      required
                      type="email"
                      id="email"
                      placeholder="john@business.com"
                      className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all text-lg"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="business"
                      className="text-slate-700 font-semibold"
                    >
                      Business Name{" "}
                      <span className="text-slate-400 font-normal">
                        (Optional)
                      </span>
                    </Label>
                    <Input
                      id="business"
                      placeholder="Acme Corp"
                      className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all text-lg"
                      value={userData.business}
                      onChange={(e) =>
                        setUserData({ ...userData, business: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl py-7 rounded-xl shadow-lg shadow-blue-200 transition-all hover:translate-y-[-2px] active:translate-y-[0px] font-heading font-bold group"
                  >
                    Begin Diagnostic
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-center text-slate-400 text-sm">
                    Takes about 3-5 minutes
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "quiz" && (
          <motion.div
            key="quiz-step"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-2xl px-4"
          >
            <div className="mb-10 space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-blue-600 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    {React.createElement(
                      PILLAR_ICONS[QUESTIONS[currentQuestionIdx].pillar],
                      { size: 16 },
                    )}
                    {QUESTIONS[currentQuestionIdx].pillar}
                  </span>
                  <h2 className="text-slate-500 text-sm font-medium">
                    Question {currentQuestionIdx + 1} of {QUESTIONS.length}
                  </h2>
                </div>
                <span className="text-slate-400 text-sm font-mono">
                  {Math.round(
                    ((currentQuestionIdx + 1) / QUESTIONS.length) * 100,
                  )}
                  %
                </span>
              </div>
              <Progress
                value={((currentQuestionIdx + 1) / QUESTIONS.length) * 100}
                className="h-2 bg-slate-100"
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-white/90 backdrop-blur-xl p-2">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl md:text-3xl font-heading font-bold text-slate-900 leading-tight">
                      {QUESTIONS[currentQuestionIdx].text}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <RadioGroup
                      onValueChange={handleAnswer}
                      value={answers[
                        QUESTIONS[currentQuestionIdx].id
                      ]?.toString()}
                      className="grid grid-cols-1 gap-3"
                    >
                      {[1, 2, 3, 4, 5].map((val, i) => (
                        <motion.div
                          key={val}
                          custom={i}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div
                            className={cn(
                              "flex items-center space-x-3 border-2 p-5 rounded-2xl transition-all cursor-pointer group",
                              answers[QUESTIONS[currentQuestionIdx].id] === val
                                ? "border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10"
                                : "border-slate-100 hover:border-slate-300 hover:bg-slate-50",
                            )}
                            onClick={() => handleAnswer(val.toString())}
                          >
                            <RadioGroupItem
                              value={val.toString()}
                              id={`v${val}`}
                              className="border-slate-300 text-blue-600"
                            />
                            <Label
                              htmlFor={`v${val}`}
                              className="flex-1 cursor-pointer font-bold text-lg text-slate-700 select-none group-hover:text-slate-900"
                            >
                              {val === 1 && "Strongly Disagree"}
                              {val === 2 && "Disagree"}
                              {val === 3 && "Neutral"}
                              {val === 4 && "Agree"}
                              {val === 5 && "Strongly Agree"}
                            </Label>
                            {answers[QUESTIONS[currentQuestionIdx].id] ===
                              val && (
                              <CheckCircle2
                                className="text-blue-500 shrink-0"
                                size={20}
                              />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </RadioGroup>
                    <div className="pt-4">
                      <Button
                        disabled={!answers[QUESTIONS[currentQuestionIdx].id]}
                        onClick={nextQuestion}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-8 text-xl rounded-2xl transition-all disabled:opacity-30 group"
                      >
                        {currentQuestionIdx === QUESTIONS.length - 1
                          ? "Reveal My Results"
                          : "Next Question"}
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {step === "results" && (
          <motion.div
            key="results-step"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-4xl px-4 py-10"
          >
            {(() => {
              const { scores, total, lowestPillar } = calculateScores();
              const resultCategory = GET_CATEGORY(total);

              return (
                <div className="space-y-10">
                  <header className="text-center space-y-4">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-bold text-xs tracking-widest uppercase mb-4"
                    >
                      Your Diagnostic Profile
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-heading font-black text-slate-900 tracking-tight">
                      {resultCategory.title}
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                      {resultCategory.desc}
                    </p>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(Object.keys(scores) as Pillar[]).map((p, i) => (
                          <motion.div
                            key={p}
                            custom={i}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className={cn(
                              "p-6 rounded-3xl border-2 transition-all relative overflow-hidden",
                              p === lowestPillar
                                ? "border-amber-400/50 bg-amber-50/30"
                                : "border-slate-100 bg-white shadow-sm",
                            )}
                          >
                            <div className="flex justify-between items-start mb-6">
                              <div
                                className={cn(
                                  "p-3 rounded-2xl",
                                  PILLAR_COLORS[p],
                                )}
                              >
                                {React.createElement(PILLAR_ICONS[p], {
                                  size: 24,
                                })}
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-slate-400 uppercase font-bold tracking-tighter">
                                  Score
                                </span>
                                <p className="text-2xl font-black text-slate-800">
                                  {scores[p]}
                                  <span className="text-slate-300 text-sm">
                                    /20
                                  </span>
                                </p>
                              </div>
                            </div>
                            <h3 className="font-heading font-bold text-xl text-slate-900 mb-1">
                              {p}
                            </h3>
                            <Progress
                              value={(scores[p] / 20) * 100}
                              className={cn(
                                "h-2 mt-4",
                                p === lowestPillar
                                  ? "bg-amber-200"
                                  : "bg-slate-100",
                              )}
                            />
                            {p === lowestPillar && (
                              <div className="absolute top-2 right-2">
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  Priority
                                </span>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="p-8 rounded-3xl bg-slate-900 text-white shadow-2xl overflow-hidden relative"
                      >
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                          <div className="bg-amber-500 p-4 rounded-2xl shrink-0 h-fit">
                            <AlertCircle size={32} className="text-white" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-2xl font-heading font-bold text-amber-400">
                              Biggest Constraint:{" "}
                              <span className="text-white underline decoration-amber-400 underline-offset-4">
                                {lowestPillar}
                              </span>
                            </h3>
                            <p className="text-slate-300 text-lg leading-relaxed">
                              This is your leverage point. Solving the friction
                              in{" "}
                              <span className="font-bold text-white">
                                {lowestPillar}
                              </span>{" "}
                              will unlock progress across all other areas of
                              your business.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="space-y-6">
                      <Card className="border-none bg-blue-600 text-white shadow-xl shadow-blue-200 rounded-3xl p-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <CardHeader className="text-center pt-8">
                          <CardTitle className="text-2xl font-heading font-black">
                            Plan Your Next Move
                          </CardTitle>
                          <CardDescription className="text-blue-100 text-base">
                            Book a 30-minute FLOW Strategy Session to map out
                            your solution.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-8 px-6 space-y-6">
                          <div className="space-y-3 bg-white/10 p-4 rounded-2xl border border-white/10">
                            {[
                              "Personalized diagnosis",
                              "3 immediate action items",
                              "Resource recommendations",
                            ].map((item, id) => (
                              <div
                                key={id}
                                className="flex items-center gap-3 text-sm font-medium"
                              >
                                <CheckCircle2
                                  size={16}
                                  className="text-blue-200 shrink-0"
                                />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                          <Button
                            onClick={() =>
                              (window.location.href =
                                "https://calendly.com/your-link")
                            }
                            className="w-full bg-white text-blue-600 hover:bg-slate-100 py-8 text-xl font-bold rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                          >
                            Book Session
                          </Button>
                          <p className="text-center text-blue-200 text-xs italic">
                            Strictly for founders generating $500k+
                          </p>
                        </CardContent>
                      </Card>

                      <div className="p-6 rounded-3xl border border-dashed border-slate-300 flex flex-col items-center text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <ArrowRight size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">
                            Retake Diagnostic
                          </h4>
                          <p className="text-sm text-slate-500">
                            Want to try again or share with a partner?
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => window.location.reload()}
                          className="text-blue-600 font-bold hover:bg-blue-50"
                        >
                          Restart Diagnostic
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
