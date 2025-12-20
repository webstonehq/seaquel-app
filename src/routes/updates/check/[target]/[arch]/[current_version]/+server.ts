import { json } from "@sveltejs/kit";

export const GET = ({ params }) => {
  console.log("Checking for available updates.", {params});
  const isUpdateAvailable = Math.random() < 0.5;
  if (isUpdateAvailable) {
    json({
      version: "",
      pub_date: "",
      url: "",
      signature: "",
      notes: "",
    });
  } else {
    return new Response(null, { status: 204 });
  }
};
