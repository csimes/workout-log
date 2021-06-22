const Express = require("express");
const router = Express.Router();
let validateSession = require("../middleware/validate-session")
const { LogModel } = require("../models")

router.post("/", validateSession, async (req, res)=> {
    const { description , definition, result } = req.body;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get("/", validateSession, async (req, res) => {
    const { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


router.get("/:id", validateSession, async (req, res) => {
    const { id } = req.params;
    try {
        const logById = await LogModel.findAll({
            where: {
                id: id
            }
        });
        res.status(200).json(logById);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});



module.exports = router; 