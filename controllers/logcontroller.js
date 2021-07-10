const Express = require("express");
const router = Express.Router();
let validateSession = require("../middleware/validate-session")
const { LogModel } = require("../models")

router.post("/", validateSession, async (req, res)=> {
    const { description , definition, result } = req.body.log;
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
    const userId = req.user.id;
    const logId = req.params.id
    try {
        const logByUser = await LogModel.findAll({
            where: {
                owner_id: userId,
                id: logId
            }
        });
        res.status(200).json(logByUser);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


router.put("/:id", validateSession, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const userId = req.user.id;
    const logId = req.params.id;

    const query = {
        where: {
                owner_id: userId,
                id: logId
                
                
            }
    };
    
    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };
    
    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.delete("/:id", validateSession, async (req, res) => {
    
    const userId = req.user.id;
    const logId = req.params.id;
    
    try {

        const deletedLog = {
            where : {
                owner_id: userId,
                id: logId
            }
        };
        await LogModel.destroy(deletedLog);
        res.status(200).json({ message: "Workout Log Removed"});
    } catch (err) {
        res.status(500).json({ error: err })
    }
});


module.exports = router; 