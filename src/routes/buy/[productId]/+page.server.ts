import { env } from "$env/dynamic/public";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

const planDetails: Record<
	string,
	{
		name: string;
		price: number;
		period: string;
		description: string;
		features: string[];
		allowMultipleUnits: boolean;
	}
> = {
	individual: {
		name: "Individual",
		price: 50,
		period: "/ year",
		description: "For individual developers using Seaquel commercially.",
		features: [
			"Commercial use",
			"All features included",
			"1 year of updates",
			"1 device activation",
			"Community support",
		],
		allowMultipleUnits: false,
	},
	business: {
		name: "Business",
		price: 90,
		period: "/ year / seat",
		description:
			"For teams and organizations. Reassign seats as your team changes.",
		features: [
			"Commercial use",
			"All features included",
			"1 year of updates",
			"1 device activation per seat",
			"Priority support",
			"Transferable seats",
		],
		allowMultipleUnits: true,
	},
};

export const load: PageServerLoad = ({ params }) => {
	const tierMap = JSON.parse(env.PUBLIC_DODO_PRODUCT_MAP || '{}') as Record<string, string>;
	const tier = tierMap[params.productId];

	if (!tier || !planDetails[tier]) {
		error(404, "Product not found");
	}

	return {
		productId: params.productId,
		tier,
		plan: planDetails[tier],
		dodoMode: (env.PUBLIC_DODO_MODE || 'test') as 'test' | 'live',
	};
};
