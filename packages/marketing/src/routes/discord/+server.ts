import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = () => {
	redirect(302, "https://discord.gg/QuzUESE8x4");
};
