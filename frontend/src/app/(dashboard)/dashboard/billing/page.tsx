import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Zap } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "For solo projects",
    features: ["1 project", "Basic syncing", "GitHub integration"],
    current: true,
    cta: "Current plan",
  },
  {
    name: "Pro",
    price: "$19",
    description: "For active freelancers",
    features: ["Unlimited projects", "All integrations", "PDF reports", "Priority support"],
    current: false,
    cta: "Upgrade to Pro",
  },
  {
    name: "Agency",
    price: "$49",
    description: "For teams & agencies",
    features: ["Everything in Pro", "Team members", "Client portal", "Custom reports"],
    current: false,
    cta: "Upgrade to Agency",
  },
];

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-muted-foreground text-sm">Manage your subscription plan.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <Card key={plan.name} className={plan.current ? "border-primary" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{plan.name}</CardTitle>
                {plan.current && (
                  <Badge variant="default" className="text-xs">
                    Current
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">/mo</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-4 pt-4">
              <ul className="flex flex-col gap-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.current ? "outline" : "default"}
                size="sm"
                disabled={plan.current}
              >
                {!plan.current && <Zap className="size-3" data-icon="inline-start" />}
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Stripe billing integration coming soon. Plans displayed above are for preview purposes.
      </p>
    </div>
  );
}
