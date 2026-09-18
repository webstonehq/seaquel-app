/**
 * In-memory platform adapter for local dev. Fakes a 2-second
 * provisioning delay then reports `ready`. Backing state is a simple
 * `Map<machineId, state>` that resets on server restart.
 *
 * Selected in the adapter factory when `FLY_API_TOKEN` is unset.
 * Safe to ship in the production bundle — it only activates when
 * credentials are missing, and in prod they're required.
 */
import type {
  PlatformAdapter,
  ProvisionRequest,
  TenantHandle,
  TenantStatus,
} from "./types";

interface MockMachine {
  startedAt: number;
  slug: string;
}

const machines = new Map<string, MockMachine>();

export class MockPlatformAdapter implements PlatformAdapter {
  readonly name = "fly" as const;

  async provision(req: ProvisionRequest): Promise<TenantHandle> {
    const machineId = `mock_${req.slug}_${Date.now().toString(36)}`;
    machines.set(machineId, { startedAt: Date.now(), slug: req.slug });
    return {
      machineId,
      originUrl: `http://127.0.0.1:8787`, // what a local tenant container would expose
    };
  }

  async deprovision(handle: TenantHandle): Promise<void> {
    machines.delete(handle.machineId);
  }

  async status(handle: TenantHandle): Promise<TenantStatus> {
    const m = machines.get(handle.machineId);
    if (!m) return { state: "failed", reason: "machine not found" };
    // Simulate a 2-second provisioning window so the dashboard's polling
    // loop has something real to show.
    const elapsed = Date.now() - m.startedAt;
    return elapsed >= 2000 ? { state: "ready" } : { state: "provisioning" };
  }
}
