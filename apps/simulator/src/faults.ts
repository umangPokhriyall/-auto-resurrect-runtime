// faults.ts

export type FaultType =
    | "PROCESSOR_STALL"
    | "LATENCY_SPIKE"
    | "SILENT_SENSOR_FAILURE";

export class FaultInjector {
    private static activeFaults = new Set<FaultType>();

    static injectFault(fault: FaultType) {
        console.log(`[FAULT-INJECTOR] Injecting fault: ${fault}`);
        this.activeFaults.add(fault);
    }

    static clearFault(fault: FaultType) {
        console.log(`[FAULT-INJECTOR] Clearing fault: ${fault}`);
        this.activeFaults.delete(fault);
    }

    static hasFault(fault: FaultType): boolean {
        return this.activeFaults.has(fault);
    }
}
