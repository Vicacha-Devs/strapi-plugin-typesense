import { Core } from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async search(ctx: any) {
    const { collection, q, page, per_page, filter_by, sort_by, vector_query } = ctx.query;

    if (!collection) {
      return ctx.badRequest("Collection parameter is required");
    }

    const parsedPage = Math.max(1, page ? parseInt(page as string, 10) || 1 : 1);
    const parsedPerPage = Math.min(250, Math.max(1, per_page ? parseInt(per_page as string, 10) || 10 : 10));

    try {
      const searchService = strapi.plugin("typesense").service("search");
      const results = await searchService.search(collection as string, {
        q: (q as string) || "*",
        page: parsedPage,
        per_page: parsedPerPage,
        filter_by: filter_by as string,
        sort_by: sort_by as string,
        vectorQuery: vector_query as string,
      });

      return results;
    } catch (error: any) {
      strapi.log.error("[Typesense Controller] Search error:", error);
      return ctx.internalServerError("Failed to execute search query.");
    }
  },
});
