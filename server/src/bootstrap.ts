import type { Core } from "@strapi/strapi";

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.log.info("[Typesense Plugin] Initializing Typesense Integration...");
  const typesenseService = strapi.plugin("typesense").service("typesense");

  const isHealthy = await typesenseService.healthCheck();
  if (isHealthy) {
    strapi.log.info("[Typesense Plugin] Connected to Typesense server successfully!");
    const lifecycleService = strapi.plugin("typesense").service("lifecycle");
    lifecycleService.subscribeToLifecycles();
  } else {
    strapi.log.warn(
      "[Typesense Plugin] Could not connect to Typesense server. Please verify your settings or environment variables."
    );
  }
};

export default bootstrap;