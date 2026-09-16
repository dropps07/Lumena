CREATE TABLE "gradients" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
    "slug" text NOT NULL,
    "config" jsonb NOT NULL,
    "created_at" timestamp
    with
        time zone DEFAULT now(),
        "view_count" integer DEFAULT 0,
        CONSTRAINT "gradients_slug_unique" UNIQUE ("slug")
);