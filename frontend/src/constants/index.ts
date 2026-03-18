import { ArrowUpRight, Clock, Lock } from "lucide-react";

export const FORM_LABEL = {
  name: "Name",
  email: "Email",
  password: "Password",
};

export const INPUT_PLACEHOLDER = {
  name: "Enter your name",
  email: "Enter your email",
  password: "Enter your password",
};

export const FIELD_TYPES = {
  name: "text",
  email: "email",
  password: "password",
};

export const features = [
  {
    icon: Clock,
    title: "Save 10+ hours weekly",
    des: "Let AI handle the manual status updates, ticket transitions, and client follow-ups while you focus on deep work.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    des: "Your data is encrypted at rest and in transit. We only sync the metadata required to keep your workflow moving.",
  },
  {
    icon: ArrowUpRight,
    title: "Automated Reporting",
    des: "Generate beautiful PDF performance reports and invoices automatically based on your GitHub and Linear activity",
  },
];
