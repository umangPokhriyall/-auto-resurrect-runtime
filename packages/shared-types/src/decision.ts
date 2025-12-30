// packages/shared-types/src/decision.ts

import type { FaultSignature } from "./fault";

export type RecoveryActionType =
    | "RESTART_MODULE"
    | "DEGRADE_MODE"
    | "NO_OP";

export interface Decision {
    signature: FaultSignature;
    action: RecoveryActionType;
    target: string;
    reason: string;
}
