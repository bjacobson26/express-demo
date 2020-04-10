const Joi = require('joi');
const express = require('express');
const app = express();

// enable middleware for json parsing
app.use(express.json());

const courses = [
    { id: 1, name: 'Math' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'English' }
]

app.get('/', (req, res) => {
    res.send('Hello world!!!');
})

app.get('/api/courses', (req, res) => {
    res.send(courses);
})

app.get('/api/courses/:id', (req, res) => {  
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send({ error: 'course not found'})
    res.send(course);
})

app.post('/api/courses', (req, res) => {
    const schema = {
        name: Joi.string().min(3).required()
    }

    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);

    res.status(201).send(course);
})

app.put('/api/courses/:id', (req, res) => {
    // look up course
    // if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send({ error: 'course not found'})
    
    // validate
    // if invalid, return 400
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // update course
    course.name = req.body.name;
    res.send(course);
})

app.delete('/api/courses/:id', (req, res) => {
    // look up course
    // not existing? 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send({ error: 'course not found'})
    // delete
    const index = courses.indexOf(course);
    courses.splice(index, 1)

    // return the same course
    res.send(course);
})

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema);
}

// PORT
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
