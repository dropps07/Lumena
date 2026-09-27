import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockDeep, mockReset, DeepMockProxy } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";

// Mock the db module BEFORE importing queries.ts, so queries.ts
// receives the mocked client instead of a real one
vi.mock("./index", () => ({
  db: mockDeep<PrismaClient>(),
}));

import { db } from "./index";
import { saveGradient, getGradientBySlug, listGradients } from "./queries";

const mockDb = db as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(mockDb);
});

describe("saveGradient", () => {
  it("calls prisma.gradient.create with a generated slug and the given config", async () => {
    const config = { blur: 10, colors: ["#000", "#fff"] };
    mockDb.gradient.create.mockResolvedValue({
      id: "test-id",
      slug: "abc12345",
      config,
      createdAt: new Date(),
      viewCount: 0,
    });

    const result = await saveGradient(config);

    expect(mockDb.gradient.create).toHaveBeenCalledWith({
      data: { slug: expect.any(String), config },
    });
    expect(result.slug).toBe("abc12345");
  });
});

describe("getGradientBySlug", () => {
  it("queries by slug and returns the matching gradient", async () => {
    const fakeGradient = {
      id: "test-id",
      slug: "xyz789",
      config: { blur: 5 },
      createdAt: new Date(),
      viewCount: 0,
    };
    mockDb.gradient.findUnique.mockResolvedValue(fakeGradient);

    const result = await getGradientBySlug("xyz789");

    expect(mockDb.gradient.findUnique).toHaveBeenCalledWith({
      where: { slug: "xyz789" },
    });
    expect(result).toEqual(fakeGradient);
  });

  it("returns null when no gradient matches the slug", async () => {
    mockDb.gradient.findUnique.mockResolvedValue(null);

    const result = await getGradientBySlug("does-not-exist");

    expect(result).toBeNull();
  });
});

describe("listGradients", () => {
  it("requests page 1 with offset 0 by default", async () => {
    mockDb.gradient.findMany.mockResolvedValue([]);

    await listGradients();

    expect(mockDb.gradient.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      take: 20,
      skip: 0,
    });
  });

  it("calculates the correct skip for page 3", async () => {
    mockDb.gradient.findMany.mockResolvedValue([]);

    await listGradients(3, 20);

    expect(mockDb.gradient.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      take: 20,
      skip: 40, // (3 - 1) * 20
    });
  });
});