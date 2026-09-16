import { db } from "./index";
import { nanoid } from "nanoid";

export async function saveGradient(config: object) {
  const slug = nanoid(8);
  return db.gradient.create({ data: { slug, config } });
}

export async function getGradientBySlug(slug: string) {
  return db.gradient.findUnique({ where: { slug } });
}

export async function listGradients(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  return db.gradient.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    skip,
  });
}