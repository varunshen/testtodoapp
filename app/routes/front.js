const express = require('express');
const Todo = require('./../models/Todo');

const router = express.Router();

// Home page route
router.get('/', async (req, res) => {

    if (req.oidc.isAuthenticated()) {
        const todos = await Todo.find({ created_by: req.oidc.user.email })
        res.render("todos", {
            tasks: (Object.keys(todos).length > 0 ? todos : {})
        });
    }
    else {
        res.redirect('/login');
    }
});

// POST - Submit Task
router.post('/', (req, res) => {
    const newTask = new Todo({
        task: req.body.task,
        created_by: req.oidc.user.email
    });

    newTask.save()
        .then(task => res.redirect('/'))
        .catch(err => console.log(err));
});

// POST - Destroy todo item
router.post('/todo/destroy', async (req, res) => {
    const taskKey = req.body._key;
    const err = await Todo.findOneAndRemove({ _id: taskKey })
    res.redirect('/');
});


module.exports = router;