const tempRoutes = require('./temp_routes');
module.exports = function(app, db) {
  tempRoutes(app, db);
  // Other route groups could go here, in the future
};
