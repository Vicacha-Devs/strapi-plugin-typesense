<p align="center">
  <img src="./logo.svg" width="160" height="160" alt="Strapi Typesense Plugin Logo">
</p>

<h1 align="center">Strapi 5 Typesense Plugin</h1>

<p align="center">
  <b>Unified Full-Text, Vector, and Hybrid Search Engine for Strapi 5</b><br>
  An open-source alternative to Algolia & Pinecone integration for Strapi CMS.
</p>

---

## ⚡ Features

- 🔍 **Full-Text Keyword Search**: Lightning fast indexing & search powered by Typesense.
- 🧠 **Vector & Semantic Search**: Native vector search support for AI embeddings (`float[]`).
- 🔀 **Hybrid Search**: Combine keyword relevance (`q`) and vector similarity (`vector_query`) seamlessly.
- 🤖 **Auto-Embeddings**: Built-in support for Typesense auto-embedding models (e.g. `ts/all-MiniLM-L6-v2`).
- 🔄 **Real-Time Lifecycle Sync**: Automatic indexing on entry creation, update, and deletion in Strapi 5.
- 🎨 **Admin UI Dashboard**: Built with `@strapi/design-system` for status monitoring and collection mapping.
- 🔐 **Secure Proxy Endpoint**: Public `/api/typesense/search` endpoint without exposing admin API keys.

---

## 📦 Installation

In your Strapi v5 project:

```bash
npm install @juadariasmar/strapi-plugin-typesense
# or
yarn add @juadariasmar/strapi-plugin-typesense
```

---

## ⚙️ Configuration

Enable and configure the plugin in `config/plugins.js` or `config/plugins.ts`:

```js
module.exports = ({ env }) => ({
  typesense: {
    enabled: true,
    config: {
      apiKey: env("TYPESENSE_API_KEY"),
      nodes: [
        {
          host: env("TYPESENSE_HOST", "localhost"),
          port: env.int("TYPESENSE_PORT", 8108),
          protocol: env("TYPESENSE_PROTOCOL", "http"),
        },
      ],
      collections: {
        "api::article.article": {
          name: "articles",
          facets: ["category"],
          vectorField: {
            name: "embedding",
            numDim: 384,
            autoEmbed: true,
            embedFrom: ["title", "content"],
            modelName: "ts/all-MiniLM-L6-v2",
          },
        },
      },
    },
  },
});
```

---

## 🌐 Public Search API

The plugin exposes a secure content API endpoint at `GET /api/typesense/search`:

```bash
curl -X GET "http://localhost:1337/api/typesense/search?collection=articles&q=strapi"
```

### Hybrid Search Example

```bash
curl -X GET "http://localhost:1337/api/typesense/search?collection=articles&q=strapi&vector_query=embedding:([0.12,0.45,...],k:10)"
```

---

## 📄 License

[MIT](LICENSE) © Juan David Arias