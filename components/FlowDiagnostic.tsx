"use client";

import React, { useState } from "react";
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

export default function FlowDiagnostic() {
  const [step, setStep] = useState<"lead" | "quiz" | "results">("lead");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    business: "",
  });
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

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
      setCurrentQuestionIdx(currentQuestionIdx + 1);
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

  // --- Views ---
  if (step === "lead") {
    return (
      <Card className="max-w-xl mx-auto mt-10 shadow-lg border-t-4 border-t-blue-600">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            The FLOW Diagnostic
          </CardTitle>
          <CardDescription className="text-lg">
            Identify the primary constraint holding your business back.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                required
                id="name"
                placeholder="John Doe"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                required
                type="email"
                id="email"
                placeholder="john@business.com"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business">Business Name (Optional)</Label>
              <Input
                id="business"
                placeholder="Acme Corp"
                value={userData.business}
                onChange={(e) =>
                  setUserData({ ...userData, business: e.target.value })
                }
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
            >
              Begin Diagnostic
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (step === "quiz") {
    const q = QUESTIONS[currentQuestionIdx];
    const progress = ((currentQuestionIdx + 1) / QUESTIONS.length) * 100;

    return (
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm font-medium text-slate-500">
            <span>Section: {q.pillar}</span>
            <span>
              Question {currentQuestionIdx + 1} of {QUESTIONS.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">{q.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              onValueChange={handleAnswer}
              value={answers[q.id]?.toString()}
              className="grid grid-cols-1 gap-3"
            >
              {[1, 2, 3, 4, 5].map((val) => (
                <div
                  key={val}
                  className="flex items-center space-x-3 space-y-0 border p-4 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <RadioGroupItem value={val.toString()} id={`v${val}`} />
                  <Label
                    htmlFor={`v${val}`}
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {val === 1 && "Strongly Disagree"}
                    {val === 2 && "Disagree"}
                    {val === 3 && "Neutral"}
                    {val === 4 && "Agree"}
                    {val === 5 && "Strongly Agree"}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button
              disabled={!answers[q.id]}
              onClick={nextQuestion}
              className="w-full bg-blue-600 py-6 text-lg"
            >
              {currentQuestionIdx === QUESTIONS.length - 1
                ? "See Results"
                : "Next Question"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { scores, total, lowestPillar } = calculateScores();
  const resultCategory = GET_CATEGORY(total);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 pb-20">
      <Card className="shadow-xl border-none">
        <CardHeader className="text-center bg-slate-900 text-white rounded-t-xl py-10">
          <p className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-2">
            Your Results
          </p>
          <CardTitle className="text-4xl mb-4">
            {resultCategory.title}
          </CardTitle>
          <p className="text-slate-300 max-w-md mx-auto">
            {resultCategory.desc}
          </p>
        </CardHeader>
        <CardContent className="pt-10 space-y-10">
          {/* Pillar Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Object.keys(scores) as Pillar[]).map((p) => (
              <div
                key={p}
                className={`p-4 rounded-xl border-2 ${p === lowestPillar ? "border-amber-500 bg-amber-50" : "border-slate-100"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-700">{p}</span>
                  <span className="text-sm font-semibold">
                    {scores[p]} / 20
                  </span>
                </div>
                <Progress
                  value={(scores[p] / 20) * 100}
                  className={`h-2 ${p === lowestPillar ? "bg-amber-200" : ""}`}
                />
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
            <h3 className="text-blue-900 font-bold text-xl mb-2">
              Your Biggest Constraint: {lowestPillar}
            </h3>
            <p className="text-blue-800">
              This is your leverage point. One focused shift here will unlock
              progress everywhere else.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() =>
                (window.location.href = "https://calendly.com/your-link")
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-8 text-xl font-bold shadow-lg shadow-blue-200"
            >
              Book Your FLOW Session
            </Button>
            <p className="text-center text-slate-500 text-sm italic">
              A 30-minute session to diagnose your biggest constraint and map
              out your next move.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
