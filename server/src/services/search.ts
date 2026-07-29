import { Core } from "@strapi/strapi";
import { SearchParams } from "typesense/lib/Typesense/Documents";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async search(collectionName: string, queryParams: SearchParams & { vectorQuery?: string }) {
    const typesenseService = strapi.plugin("typesense").service("typesense");
    const client = typesenseService.getClient();
    if (!client) throw new Error("Typesense client not initialized");

    const searchOptions: SearchParams = {
      q: queryParams.q || "*",
      query_by: queryParams.query_by || "title,content",
      page: queryParams.page || 1,
      per_page: queryParams.per_page || 10,
      filter_by: queryParams.filter_by,
      sort_by: queryParams.sort_by,
      facet_by: queryParams.facet_by,
    };

    if (queryParams.vectorQuery) {
      (searchOptions as any).vector_query = queryParams.vectorQuery;
    }

    return await client.collections(collectionName).documents().search(searchOptions);
  },

  async hybridSearch(collectionName: string, queryText: string, vector: number[], k = 10) {
    const typesenseService = strapi.plugin("typesense").service("typesense");
    const client = typesenseService.getClient();
    if (!client) throw new Error("Typesense client not initialized");

    const vectorQuery = `embedding:([${vector.join(",")}], k:${k})`;

    return await client.collections(collectionName).documents().search({
      q: queryText,
      query_by: "title,content",
      vector_query: vectorQuery,
    } as any);
  },
});
