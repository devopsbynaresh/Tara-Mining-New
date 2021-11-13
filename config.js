const config = {
  app: {
    host: "localhost",
    port: 3000,
  },
  db: {
    host: "localhost",
    port: 27017,
    name: "tara",
  },
  equip: {
    maxResultsPerPage: 9,
    maxSearchResults: 24,
    maxFilterResults: 24,
  },
  mail: {
    service: "gmail",
    auth: {
      user: "taraemailservice@gmail.com",
      pass: "test123@",
    },
  },
  admin: {
    adminKey: "hkme03P@mauve",
  },
};

module.exports = config;
