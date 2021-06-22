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



router.get("/:id", validateSession, async (req, res) => {
    const { id } = req.user;
    try {
        const userJournals = await JournalModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userJournals);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


/*
=========================
    Get Journals by Title
=========================
 */

router.get("/:title", async (req, res) => {
    const { title } = req.params;
    try {
        const results = await JournalModel.findAll({
            where: { title: title }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
=========================
    Update a Journal
=========================
 */

router.put("/update/:entryId", validateSession, async (req, res) => {
    const { title, date, entry } = req.body.journal;
    const journalId = req.params.entryId;
    const userId = req.user.id;

    const query = {
        where: {
            id: journalId,
            owner: userId
        }
    };
    
    const updatedJournal = {
        title: title,
        date: date,
        entry: entry
    };
    
    try {
        const update = await JournalModel.update(updatedJournal, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

/*
=========================
    Delete a Journal
=========================
 */

router.delete("/delete/:id", validateSession, async (req, res) => {
    const ownerId = req.user.id;
    const journalId = req.params.id;
    
    try {
        const query = {
            where : {
                id: journalId,
                owner: ownerId
            }
        };
        await JournalModel.destroy(query);
        res.status(200).json({ message: "Journal Entry Removed"});
    } catch (err) {
        res.status(500).json({ error: err })
    }
});





module.exports = router; 