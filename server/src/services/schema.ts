import { Core } from "@strapi/strapi";
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import { CollectionFieldSchema } from "typesense/lib/Typesense/Collection";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  mapStrapiTypeToTypesense(type: string): string {
    switch (type) {
      case "string":
      case "text":
      case "richtext":
      case "email":
      case "uid":
      case "enumeration":
        return "string";
      case "integer":
      case "biginteger":
        return "int64";
      case "float":
      case "decimal":
        return "float";
      case "boolean":
        return "bool";
      case "date":
      case "datetime":
      case "time":
      case "timestamp":
        return "int64";
      case "json":
        return "object";
      default:
        return "string";
    }
  },

  buildCollectionSchema(contentTypeUid: string, collectionConfig?: any): CollectionCreateSchema {
    const contentType = strapi.contentTypes[contentTypeUid];
    if (!contentType) {
      throw new Error(`Content type ${contentTypeUid} not found`);
    }

    const collectionName = collectionConfig?.name || contentType.info.singularName || contentTypeUid.replace("::", "_");
    const fields: CollectionFieldSchema[] = [
      { name: "id", type: "string" },
      { name: "createdAt", type: "int64", optional: true },
      { name: "updatedAt", type: "int64", optional: true },
    ];

    const attributes = contentType.attributes;
    for (const [fieldName, attr] of Object.entries(attributes) as [string, any][]) {
      if (attr.type) {
        const tsType = this.mapStrapiTypeToTypesense(attr.type);
        fields.push({
          name: fieldName,
          type: tsType as any,
          optional: true,
          facet: collectionConfig?.facets?.includes(fieldName) || false,
        });
      }
    }

    // Vector search & Auto-embeddings support
    if (collectionConfig?.vectorField) {
      const vectorFieldName = collectionConfig.vectorField.name || "embedding";
      const numDim = collectionConfig.vectorField.numDim || 384;
      
      if (collectionConfig.vectorField.autoEmbed) {
        fields.push({
          name: vectorFieldName,
          type: "float[]",
          num_dim: numDim,
          embed: {
            from: collectionConfig.vectorField.embedFrom || ["title", "content"],
            model_config: {
              model_name: collectionConfig.vectorField.modelName || "ts/all-MiniLM-L6-v2",
            },
          },
        } as any);
      } else {
        fields.push({
          name: vectorFieldName,
          type: "float[]",
          num_dim: numDim,
        } as any);
      }
    }

    return {
      name: collectionName,
      fields,
      default_sorting_field: collectionConfig?.defaultSortingField || "createdAt",
    };
  },

  async ensureCollectionExists(contentTypeUid: string, collectionConfig?: any) {
    const typesenseService = strapi.plugin("typesense").service("typesense");
    const client = typesenseService.getClient();
    if (!client) return;

    const schema = this.buildCollectionSchema(contentTypeUid, collectionConfig);

    try {
      await client.collections(schema.name).retrieve();
      strapi.log.info(`[Typesense] Collection ${schema.name} already exists.`);
    } catch (error: any) {
      if (error.httpStatus === 404) {
        strapi.log.info(`[Typesense] Creating collection ${schema.name}...`);
        await client.collections().create(schema);
      } else {
        throw error;
      }
    }
  },
});
