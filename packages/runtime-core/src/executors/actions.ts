import type { Decision } from "shared-types/client";

const inProgress = new Set<string>();

export function executeDecision(
    decision: Decision,
    system: any
) {
    const key = `${decision.action}:${decision.target}`;

    if (inProgress.has(key)) {
        return;
    }

    inProgress.add(key);

    switch (decision.action) {
        case "RESTART_MODULE":
            console.log(`[ACTION] Restarting ${decision.target}`);
            system.restartModule(decision.target);
            break;

        case "DEGRADE_MODE":
            console.log(`[ACTION] Degrading ${decision.target}`);
            system.degradeModule(decision.target);
            break;

        case "NO_OP":
            console.log("[ACTION] No action taken");
            break;
    }

    // recovery cooldown
    setTimeout(() => inProgress.delete(key), 1000);
}
