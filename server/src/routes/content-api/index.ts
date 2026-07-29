export default () => ({
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/search",
      handler: "search.search",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
});