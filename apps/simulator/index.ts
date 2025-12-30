// apps/simulator/src/index.ts

import { EmbeddedSystem } from "./src/system";
import { FaultInjector } from "./src/faults";

const system = new EmbeddedSystem();
system.start();

setTimeout(() => {
    FaultInjector.injectFault("PROCESSOR_STALL");
}, 5000);
