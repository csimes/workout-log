const Express = require("express");
const router = Express.Router();
let validateSession = require("../middleware/validate-session")
const { LogModel } = require("../models")

// router.get("/practice", validateSession, (req, res) => {
//     res.send("Hey!! This is a practice route!")
// });

module.exports = router; 