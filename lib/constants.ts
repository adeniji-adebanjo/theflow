export type Pillar = "Focus" | "Leadership" | "Opportunity" | "Worth";

export interface Question {
  id: number;
  text: string;
  pillar: Pillar;
}

export const QUESTIONS: Question[] = [
  // Focus
  {
    id: 1,
    pillar: "Focus",
    text: "I spend most of my week on work that only I can do.",
  },
  {
    id: 2,
    pillar: "Focus",
    text: "I can clearly articulate my top 3 priorities for this quarter.",
  },
  {
    id: 3,
    pillar: "Focus",
    text: "I rarely get pulled into firefighting or urgent issues that others could handle.",
  },
  {
    id: 4,
    pillar: "Focus",
    text: "My calendar reflects my priorities, not other people's demands.",
  },
  // Leadership
  {
    id: 5,
    pillar: "Leadership",
    text: "My leadership team makes decisions without waiting for me.",
  },
  {
    id: 6,
    pillar: "Leadership",
    text: "I don't have anyone on my team I'm \"managing around.\"",
  },
  {
    id: 7,
    pillar: "Leadership",
    text: "Difficult conversations happen quickly, not months later.",
  },
  {
    id: 8,
    pillar: "Leadership",
    text: "My team challenges my thinking, not just executes my ideas.",
  },
  // Opportunity
  {
    id: 9,
    pillar: "Opportunity",
    text: "I've reviewed our pricing, products, and key partnerships in the last 12 months.",
  },
  {
    id: 10,
    pillar: "Opportunity",
    text: "I'm not protecting any client, product, or process that's past its usefulness.",
  },
  {
    id: 11,
    pillar: "Opportunity",
    text: "We're actively pursuing new opportunities, not just maintaining what works.",
  },
  {
    id: 12,
    pillar: "Opportunity",
    text: "I know exactly what we'd do differently if our biggest client left tomorrow.",
  },
  // Worth
  {
    id: 13,
    pillar: "Worth",
    text: "I know the true cost of my time, and I protect it accordingly.",
  },
  {
    id: 14,
    pillar: "Worth",
    text: "I regularly calculate hidden costs — not just the P&L.",
  },
  {
    id: 15,
    pillar: "Worth",
    text: "The business energises me more than it drains me.",
  },
  {
    id: 16,
    pillar: "Worth",
    text: "I could step away for a month, and the business would run without a crisis.",
  },
];

export const GET_CATEGORY = (score: number) => {
  if (score >= 65)
    return {
      title: "In FLOW",
      desc: "You've built clarity into how you lead. The business runs with intention, not reaction.",
    };
  if (score >= 50)
    return {
      title: "Pockets of Chaos",
      desc: "Some areas are working, but at least one pillar is dragging the rest down.",
    };
  if (score >= 35)
    return {
      title: "Stuck in the Spin",
      desc: "You're busy, but not building. Most of your energy goes to maintenance, not momentum.",
    };
  return {
    title: "Survival Mode",
    desc: "You're running on fumes. The business might look successful from the outside, but it's unsustainable.",
  };
};
