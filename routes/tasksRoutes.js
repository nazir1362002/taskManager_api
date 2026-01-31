const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');


router.get('/test', auth, (req, res) => {
    res.json({
        message: "Task are working!!",
        user: req.user
    });
});

//CRUD Operations
//Add Task by the authenticate User
router.post('/createTask', auth, async (req, res) => {
    try {
        //Taskname,description,completed from req.body
        //owner from req.user.id
        const task = new Task({
            ...req.body,
            owner: req.user._id
        });
        await task.save();
        res.status(201).json({ task, message: "Task Created Successfully!!" })

    } catch (error) {
        throw new Error(error.message);

    }
})
//Get tasks for login user
router.get('/getTasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({
            owner: req.user._id
        })
        res.status(200).json({ tasks, count: tasks.length, message: "Tasks fetches Successfully!!" })

    } catch (error) {
        throw new Error(error.message);

    }

});

//Get specific task by task Id
router.get('/:id', auth, async (req, res) => {
    const taskId = req.params.id;
    const task = await Task.findOne({
        _id: taskId,
        owner: req.user._id
    })
    if (!task) {
        return res.status(404).json({ message: "Task Not Found" })
    }
    res.status(200).json({ task, message: "Task fetched successfully!!" })
});
//Update a task
router.patch('/:id', auth, async (req, res) => {
    const taskId = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdate = ['taskName', 'description', 'completed'];
    isValidOperation = updates.every(update => allowedUpdate.includes(update));
    if (!isValidOperation) {
        return res.status(404).json({ error: "Invalid Updates" });
    }
    try {
        const task = await Task.findOne({
            _id: taskId,
            owner: req.user._id
        })
        if (!task) {
            return res.status(404).json({ message: "Task Not Found" })
        }
        updates.forEach(update => task[update]=req.body[update]);
        await task.save();
        res.json({
            message:"Task Update Successfully"
        })

    } catch (error) {
        res.json({
            message:"Invalid"
        })

    }

});
//Delete a task
router.delete('/:id', auth, async (req, res) => {
    const taskId = req.params.id;
    const task = await Task.findOneAndDelete({
        _id: taskId,
        owner: req.user._id
    })
    if (!task) {
        return res.status(404).json({ message: "Task Not Found" })
    }
    res.status(200).json({ task, message: "Task Deleted Successfully!!" })
});


module.exports = router;