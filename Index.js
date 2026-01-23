const express = require ('express');
const bodyparser = require ('body-parser');
const app = express();
require('dotenv').config();
const PORT = 8001;
require('./db');
const userRoutes = require('./routes/userRoutes')
const tasksRoutes = require('./routes/tasksRoutes')

app.use(bodyparser.json());
app.use('/users',userRoutes);
app.use('/tasks',tasksRoutes);


app.get('/',(req,res) => {
    res.json({ 
        message: "Task Manager API Is working!!"
    })
});

app.listen(PORT,() => {
    console.log('Server is running on port',PORT);
})