import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/utils/schema.ts",
  dbCredentials: {
    url: "postgresql://ai-mock-interviewer_owner:2EsVSeCnG6wy@ep-spring-forest-a5nqkhy6.us-east-2.aws.neon.tech/ai-mock-interviewer?sslmode=require",
  },
});
