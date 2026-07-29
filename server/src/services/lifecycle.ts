import { Core } from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const SENSITIVE_FIELDS = ["password", "resetPasswordToken", "confirmationToken", "token", "secret", "hash"];

  const sanitizeDocument = (doc: any) => {
    if (!doc || typeof doc !== "object") return doc;
    const cleanDoc = { ...doc };
    for (const field of SENSITIVE_FIELDS) {
      delete cleanDoc[field];
    }
    return cleanDoc;
  };

  return {
    subscribeToLifecycles() {
      const config = strapi.config.get("plugin::typesense") as any;
      const collectionsConfig = config?.collections || {};

      const enabledContentTypes = Object.keys(collectionsConfig);

      for (const uid of enabledContentTypes) {
        const contentType = strapi.contentTypes[uid];
        if (!contentType) continue;

        const collectionConfig = collectionsConfig[uid];
        const collectionName = collectionConfig?.name || contentType.info.singularName || uid.replace("::", "_");

        strapi.db.lifecycles.subscribe({
          models: [uid],

          async afterCreate(event: any) {
            const { result } = event;
            if (!result || !result.id) return;

            try {
              const typesenseService = strapi.plugin("typesense").service("typesense");
              const rawDoc = sanitizeDocument(result);
              const doc = {
                ...rawDoc,
                id: String(result.id),
                createdAt: result.createdAt ? new Date(result.createdAt).getTime() : Date.now(),
                updatedAt: result.updatedAt ? new Date(result.updatedAt).getTime() : Date.now(),
              };

              await typesenseService.importDocuments(collectionName, [doc], "upsert");
              strapi.log.info(`[Typesense Lifecycle] Synced created document ${result.id} to ${collectionName}`);
            } catch (error) {
              strapi.log.error(`[Typesense Lifecycle] Error syncing document ${result.id}:`, error);
            }
          },

          async afterUpdate(event: any) {
            const { result } = event;
            if (!result || !result.id) return;

            try {
              const typesenseService = strapi.plugin("typesense").service("typesense");
              const rawDoc = sanitizeDocument(result);
              const doc = {
                ...rawDoc,
                id: String(result.id),
                createdAt: result.createdAt ? new Date(result.createdAt).getTime() : Date.now(),
                updatedAt: result.updatedAt ? new Date(result.updatedAt).getTime() : Date.now(),
              };

              await typesenseService.importDocuments(collectionName, [doc], "upsert");
              strapi.log.info(`[Typesense Lifecycle] Synced updated document ${result.id} to ${collectionName}`);
            } catch (error) {
              strapi.log.error(`[Typesense Lifecycle] Error updating document ${result.id}:`, error);
            }
          },

          async afterDelete(event: any) {
            const { result } = event;
            if (!result || !result.id) return;

            try {
              const typesenseService = strapi.plugin("typesense").service("typesense");
              await typesenseService.deleteDocument(collectionName, String(result.id));
              strapi.log.info(`[Typesense Lifecycle] Deleted document ${result.id} from ${collectionName}`);
            } catch (error) {
              strapi.log.error(`[Typesense Lifecycle] Error deleting document ${result.id}:`, error);
            }
          },
        });
      }
    },
  };
};
