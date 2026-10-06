import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { compareVersions, findLatestAsset, findLatestRelease, latestJsonFor, pickRelease } from "./releases";

const r = (tag: string, o: { draft?: boolean; prerelease?: boolean; latestJson?: boolean } = {}) => ({
	tag_name: tag,
	draft: !!o.draft,
	prerelease: !!o.prerelease,
	assets: o.latestJson === false ? [] : [{ name: "latest.json", browser_download_url: `u/${tag}`, size: 1 }],
});

describe("compareVersions", () => {
	it("orders calendar versions and betas by semver", () => {
		expect(compareVersions("2026.10.0-beta.3", "2026.10.0")).toBeLessThan(0);
		expect(compareVersions("2026.10.0-beta.10", "2026.10.0-beta.2")).toBeGreaterThan(0);
		expect(compareVersions("2026.10.0", "2026.9.2")).toBeGreaterThan(0);
	});

	it("follows semver for pre-release identifiers", () => {
		expect(compareVersions("v2026.10.0-beta", "2026.10.0-beta.1")).toBeLessThan(0);
		expect(compareVersions("2026.10.0-alpha.9", "2026.10.0-beta.1")).toBeLessThan(0);
		expect(compareVersions("2026.10.0-beta.1", "2026.10.0-beta.x")).toBeLessThan(0);
		expect(compareVersions("v2026.9.2", "2026.9.2")).toBe(0);
	});

	it("is NaN for a tag it can't read", () => {
		expect(compareVersions("nightly", "2026.9.2")).toBeNaN();
		expect(compareVersions("2026.9", "2026.9.2")).toBeNaN();
	});
});

describe("pickRelease", () => {
	const list = [
		r("v2026.10.0-beta.2", { prerelease: true }),
		r("v2026.10.0-beta.3", { draft: true, prerelease: true }),
		r("v2026.9.3"),
		r("v2026.9.2"),
	];
	it("stable ignores drafts and pre-releases", () => {
		expect(pickRelease(list, "stable")?.tag_name).toBe("v2026.9.3");
	});
	it("stable picks by version, not GitHub's list order", () => {
		expect(pickRelease([r("v2026.9.2"), r("v2026.9.3")], "stable")?.tag_name).toBe("v2026.9.3");
	});
	it("beta takes the newest published by version", () => {
		expect(pickRelease(list, "beta")?.tag_name).toBe("v2026.10.0-beta.2");
		expect(pickRelease([...list, r("v2026.10.0")], "beta")?.tag_name).toBe("v2026.10.0");
	});
	it("skips a release without latest.json", () => {
		expect(pickRelease([r("v2026.9.4", { latestJson: false }), ...list], "stable")?.tag_name).toBe("v2026.9.3");
	});
	it("skips tags it can't read", () => {
		expect(pickRelease([r("nightly"), ...list], "stable")?.tag_name).toBe("v2026.9.3");
	});
	it("treats a pre-release tag as a beta even without GitHub's flag", () => {
		const unflagged = [r("v2026.10.0-beta.4"), ...list];
		expect(pickRelease(unflagged, "stable")?.tag_name).toBe("v2026.9.3");
		expect(pickRelease(unflagged, "beta")?.tag_name).toBe("v2026.10.0-beta.4");
	});
	it("is null when nothing qualifies", () => {
		expect(pickRelease([], "beta")).toBeNull();
		expect(pickRelease([r("v2026.10.0-beta.2", { prerelease: true })], "stable")).toBeNull();
	});
});

const RELEASES_URL = "https://api.github.com/repos/webstonehq/seaquel/releases?per_page=100";

/** A Map-backed stand-in for the `GITHUB_API_CACHE` KV namespace. */
function fakeKv() {
	const store = new Map<string, string>();
	const puts: { key: string; ttl: number | undefined }[] = [];
	return {
		store,
		puts,
		get: vi.fn(async (key: string) => store.get(key) ?? null),
		put: vi.fn(async (key: string, value: string, opts?: { expirationTtl?: number }) => {
			store.set(key, value);
			puts.push({ key, ttl: opts?.expirationTtl });
		}),
	};
}

function platformWith(kv: ReturnType<typeof fakeKv>): App.Platform {
	return { env: { GITHUB_API_CACHE: kv } } as unknown as App.Platform;
}

const okJson = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

/** Stubs `fetch`: the releases list, then each release's `latest.json` as `{ version: tag }`. */
function stubGitHub(releases: unknown[]) {
	const fetchMock = vi.fn(async (input: string | URL | Request) => {
		const url = String(input);
		if (url === RELEASES_URL) return okJson(releases);
		if (url.startsWith("u/")) return okJson({ version: url.slice(2) });
		return new Response("not found", { status: 404 });
	});
	vi.stubGlobal("fetch", fetchMock);
	return fetchMock;
}

describe("latestJsonFor", () => {
	beforeEach(() => {
		vi.spyOn(console, "log").mockImplementation(() => {});
		vi.spyOn(console, "error").mockImplementation(() => {});
	});
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	const list = [
		r("v2026.10.0-beta.2", { prerelease: true }),
		r("v2026.9.3"),
		r("v2026.9.2"),
	];

	it("serves the picked release's latest.json", async () => {
		stubGitHub(list);
		const stable = await latestJsonFor("stable", undefined);
		expect(stable.status).toBe(200);
		expect(await stable.json()).toEqual({ version: "v2026.9.3" });
		const beta = await latestJsonFor("beta", undefined);
		expect(await beta.json()).toEqual({ version: "v2026.10.0-beta.2" });
	});

	it("caches each channel under its own key and TTL", async () => {
		stubGitHub(list);
		const kv = fakeKv();
		await latestJsonFor("stable", platformWith(kv));
		await latestJsonFor("beta", platformWith(kv));
		expect(kv.puts).toEqual([
			{ key: "updates:latest-json", ttl: 3600 },
			{ key: "updates:latest-json:beta", ttl: 600 },
		]);
		expect(JSON.parse(kv.store.get("updates:latest-json")!)).toEqual({ version: "v2026.9.3" });
		expect(JSON.parse(kv.store.get("updates:latest-json:beta")!)).toEqual({
			version: "v2026.10.0-beta.2",
		});
	});

	it("serves a cached entry without fetching", async () => {
		const fetchMock = stubGitHub(list);
		const kv = fakeKv();
		kv.store.set("updates:latest-json:beta", JSON.stringify({ version: "cached-beta" }));
		const res = await latestJsonFor("beta", platformWith(kv));
		expect(await res.json()).toEqual({ version: "cached-beta" });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("never reads the other channel's entry", async () => {
		stubGitHub(list);
		const kv = fakeKv();
		kv.store.set("updates:latest-json", JSON.stringify({ version: "cached-stable" }));
		const beta = await latestJsonFor("beta", platformWith(kv));
		expect(await beta.json()).toEqual({ version: "v2026.10.0-beta.2" });
		expect(kv.get).not.toHaveBeenCalledWith("updates:latest-json", expect.anything());

		const kv2 = fakeKv();
		kv2.store.set("updates:latest-json:beta", JSON.stringify({ version: "cached-beta" }));
		const stable = await latestJsonFor("stable", platformWith(kv2));
		expect(await stable.json()).toEqual({ version: "v2026.9.3" });
		expect(kv2.get).not.toHaveBeenCalledWith("updates:latest-json:beta", expect.anything());
	});

	it("answers 204 when GitHub's response isn't OK", async () => {
		vi.stubGlobal("fetch", vi.fn(async () => new Response("rate limited", { status: 403 })));
		const kv = fakeKv();
		const res = await latestJsonFor("stable", platformWith(kv));
		expect(res.status).toBe(204);
		expect(kv.puts).toEqual([]);
	});

	it("answers 204 when fetch throws", async () => {
		vi.stubGlobal("fetch", vi.fn(async () => {
			throw new Error("network down");
		}));
		const res = await latestJsonFor("beta", undefined);
		expect(res.status).toBe(204);
	});
});

describe("findLatestAsset", () => {
	beforeEach(() => {
		vi.spyOn(console, "error").mockImplementation(() => {});
	});
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	const dmg = (tag: string, o: { draft?: boolean; prerelease?: boolean } = {}) => ({
		tag_name: tag,
		draft: !!o.draft,
		prerelease: !!o.prerelease,
		assets: [
			{
				name: `Seaquel_${tag.slice(1)}_aarch64.dmg`,
				browser_download_url: `dl/${tag}`,
				size: 10,
			},
		],
	});

	it("never serves a beta-suffixed tag, flagged or not, and picks by version", async () => {
		stubGitHub([
			dmg("v2026.10.0-beta.4"),
			dmg("v2026.10.0-beta.5", { prerelease: true }),
			dmg("v2026.9.4", { draft: true }),
			dmg("v2026.9.2"),
			dmg("v2026.9.3"),
		]);
		const asset = await findLatestAsset("macos-arm", undefined);
		expect(asset?.version).toBe("2026.9.3");
		expect(asset?.url).toBe("dl/v2026.9.3");
	});

	it("beta serves the newest beta and says it's a pre-release", async () => {
		stubGitHub([dmg("v2026.10.0-beta.4"), dmg("v2026.10.0-beta.5", { draft: true }), dmg("v2026.9.3")]);
		const asset = await findLatestAsset("macos-arm", undefined, "beta");
		expect(asset?.version).toBe("2026.10.0-beta.4");
		expect(asset?.prerelease).toBe(true);
	});

	it("beta falls back to a newer stable, marked as not a pre-release", async () => {
		stubGitHub([dmg("v2026.10.0"), dmg("v2026.10.0-beta.4", { prerelease: true })]);
		const asset = await findLatestAsset("macos-arm", undefined, "beta");
		expect(asset?.version).toBe("2026.10.0");
		expect(asset?.prerelease).toBe(false);
	});
});

describe("findLatestRelease", () => {
	beforeEach(() => {
		vi.spyOn(console, "error").mockImplementation(() => {});
	});
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it("names the channel's release and whether it's a pre-release", async () => {
		stubGitHub([r("v2026.10.0-beta.2", { prerelease: true }), r("v2026.9.3")]);
		expect(await findLatestRelease("beta", undefined)).toEqual({ version: "2026.10.0-beta.2", prerelease: true });
		expect(await findLatestRelease("stable", undefined)).toEqual({ version: "2026.9.3", prerelease: false });
	});

	it("is null when GitHub is unreachable", async () => {
		vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));
		expect(await findLatestRelease("beta", undefined)).toBeNull();
	});
});
