import { Core } from "@strapi/strapi";
import { Client } from "typesense";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getClient(): Client | null {
    const pluginConfig = strapi.config.get("plugin::typesense") as any;
    if (!pluginConfig || !pluginConfig.apiKey) {
      strapi.log.warn("[Typesense] API Key not configured.");
      return null;
    }

    return new Client({
      nodes: pluginConfig.nodes || [
        {
          host: "localhost",
          port: 8108,
          protocol: "http",
        },
      ],
      apiKey: pluginConfig.apiKey,
      connectionTimeoutSeconds: pluginConfig.connectionTimeoutSeconds || 10,
    });
  },

  async healthCheck(): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;
    try {
      const health = await client.health.retrieve();
      return health.ok;
    } catch (error) {
      strapi.log.error("[Typesense] Health check failed:", error);
      return false;
    }
  },

  async importDocuments(collectionName: string, documents: any[], action: "upsert" | "create" | "update" = "upsert") {
    const client = this.getClient();
    if (!client) throw new Error("Typesense client not initialized");

    return await client.collections(collectionName).documents().import(documents, { action });
  },

  async deleteDocument(collectionName: string, documentId: string) {
    const client = this.getClient();
    if (!client) throw new Error("Typesense client not initialized");

    return await client.collections(collectionName).documents(documentId).delete();
  },
});
