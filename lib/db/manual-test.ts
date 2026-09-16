import { saveGradient, getGradientBySlug, listGradients } from "./queries";

async function run() {
  const saved = await saveGradient({ colors: ["#ff0000", "#00ff00"], blur: 20 });
  console.log("Saved:", saved);

  const fetched = await getGradientBySlug(saved.slug);
  console.log("Fetched:", fetched);

  const list = await listGradients();
  console.log("List:", list);
}

run();