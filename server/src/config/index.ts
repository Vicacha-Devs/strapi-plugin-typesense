export default {
  default: {
    apiKey: process.env.TYPESENSE_API_KEY || "",
    nodes: [
      {
        host: process.env.TYPESENSE_HOST || "localhost",
        port: parseInt(process.env.TYPESENSE_PORT || "8108", 10),
        protocol: process.env.TYPESENSE_PROTOCOL || "http",
      },
    ],
    connectionTimeoutSeconds: 10,
    searchApiKey: process.env.TYPESENSE_SEARCH_API_KEY || "",
    collections: {},
  },
  validator(config: any) {
    if (!config) {
      throw new Error("Typesense plugin configuration is missing");
    }
  },
};