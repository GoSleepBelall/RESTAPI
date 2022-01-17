const express = require('express');
const Joi = require('joi');
const app = express();


app.use(express.json());

function validateCourse(course)
{
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

const courses = [
    {id: 1, name: 'English'},
    {id: 2, name: 'Urdu'},
    {id: 3, name: 'Math'},
    {id: 4, name: 'Physics'},
    {id: 5, name: 'Biology'}
];

app.get('/', (req,res)=>{
   //route handler
    res.send("You're trying to access the server without a request");
});

app.get('/api/courses', (req, res)=>{
    res.send(courses);
});

//api/courses/parameter
app.get('/api/courses/:id', (req, res)=>{
   const course = courses.find(c => c.id === parseInt( req.params.id));
   if(!course)
    {
            return res.status(404).send('Course not find')
    }
    else{
            res.send(course);
    }
});

app.post('/api/courses', (req, res) =>{

    const {error} = validateCourse(req.body);
    if(error)
    {
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});


app.put('/api/courses/:id', (req, res)=>{
    //If not existing, return 404 (NOT FOUND)
    const course = courses.find(c => c.id === parseInt( req.params.id));
    if(!course)
    {
        res.status(404).send('Course not find')
        return;
    }
    //validate
    //If invalid, return 400 (BAD REQUEST)
    const {error} = validateCourse(req.body);
    if(error)
    {
        res.status(400).send(error.details[0].message);
        return;
    }
    //If Valid, return 200 (SUCCESS)
    //Update Coure, return the updated course

    course.name = req.body.name;
    res.send(course);

});


app.delete('/api/courses/:id', (req, res)=>{
    //if course is not found
    const course = courses.find(c => c.id === parseInt( req.params.id));
    if(!course)
    {
        res.status(404).send('Course not find')
        return;
    }

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});
const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> console.log(`listening on port ${PORT}` ));