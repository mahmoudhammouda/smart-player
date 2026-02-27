import { useParams, useLocation } from "wouter";
import { MOCK_SCENARIOS } from "@/data/mock-scenarios";
import { SmartPlayer } from "@/components/player/SmartPlayer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { SlideNode } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function ScenarioPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const index = MOCK_SCENARIOS.findIndex((s) => s.id === params.id);
  const scenario = MOCK_SCENARIOS[index];
  const prevScenario = MOCK_SCENARIOS[index - 1];
  const nextScenario = MOCK_SCENARIOS[index + 1];

  if (!scenario) {
    return (
      <div className="scenario-not-found">
        <p className="text-muted-foreground">Scenario not found.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  const handleRefineNode = (nodeId: string, node: SlideNode) => {
    toast({
      title: "Node refinement simulated",
      description: `Block "${node.label || nodeId}" would be sent to the LLM agent for refinement.`,
    });
  };

  return (
    <div className="scenario-page">
      <div className="scenario-nav">
        {prevScenario ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/scenario/${prevScenario.id}`)}
            data-testid="button-prev-scenario"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {prevScenario.name}
          </Button>
        ) : <div />}
        {nextScenario ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/scenario/${nextScenario.id}`)}
            data-testid="button-next-scenario"
          >
            {nextScenario.name}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : <div />}
      </div>

      <SmartPlayer slide={scenario.slide} onRefineNode={handleRefineNode} />
    </div>
  );
}
