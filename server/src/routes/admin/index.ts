export default () => ({
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/settings",
      handler: "settings.getSettings",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/health",
      handler: "settings.getHealth",
      config: {
        policies: [],
      },
    },
  ],
});