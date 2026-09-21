export type WhyValue = {
  icon: "shield" | "award" | "zap" | "clock";
  title: string;
  description: string;
};

export type WhySection = {
  eyebrow: string;
  title: string;
  items: WhyValue[];
};
