import { Core } from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getSettings(ctx: any) {
    const config = strapi.config.get("plugin::typesense") as any;
    return {
      apiKey: config.apiKey ? "*****" : "",
      nodes: config.nodes,
      searchApiKey: config.searchApiKey ? "*****" : "",
    };
  },

  async getHealth(ctx: any) {
    const typesenseService = strapi.plugin("typesense").service("typesense");
    const isHealthy = await typesenseService.healthCheck();
    return { healthy: isHealthy };
  },
});
