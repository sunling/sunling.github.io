const { handleWorkshopSignup } = require("./lib/workshopSignup");

exports.handler = async (event) => handleWorkshopSignup(event, process.env);
