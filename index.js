
const Joi = require("joi");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8888;

const courses = [
    {
        id:1,
        name:"Java"
    },
    {
        id:2,
        name:"Python"
    },
    {
        id:3,
        name:"Data structure and algorithm"
    },
    {
        id:4,
        name:"Back end developer"
    },
    {
        id:5,
        name:"Front end developer"
    },
    {
        id:6,
        name:"Machine learning"
    }
];

// middleware 
app.use(express.json());

app.get('/' , (req,res) => {
    res.send("Hello,REST API");
});

app.get('/api/courses' , (req,res) => {
    res.send(courses);
});
/**
 * get a course with specific id
 */
app.get('/api/courses/:id', (req,res) => {
    const ID = parseInt(req.params.id);
    const course = courses.find((c) => c.id === ID);
    if(!course) {
       return res.status(404).send({
            message:"course with given id does not exist"
        });

    }

    res.send(course);
});

/**
 * creating a post request
 */
app.post('/api/courses', (req,res) => {
    // validation of request using joi
    
    const result = validateCourse(req.body); 

    if(result.error){
        res.status(404).send(result.error);
        return;
    }
    const course = {
        id : courses.length + 1,
        name: req.body.name
    }

    courses.push(course);
    res.send(course);
});

/**
 * Handling a update request
 */
app.put('/api/courses/:id', (req,res) => {
    // find the course with the given id
    // if the course does not exist return an error with 404
    const ID = parseInt(req.params.id);
    const course = courses.find((c) => c.id === ID);
    if(!course) {
        res.status(404).send("course with the given id does not exist");
        return;
    }

    // Validate 
    // If invalid return 404 - Bad request
    const result = validateCourse(req.body);
    
    if(result.error) {
        res.status(404).send(result.error);
        return;
    }

    // Update the course
    // Return the updated course
    course.name = req.body.name;
    res.send(course);
});
/**
 * Handling a delete request
 */
app.delete('/api/courses/:id', (req,res) => {
    // Look up for the course
    // if the coures does not exist return 404 - bad request
    const ID = parseInt(req.params.id);
    const course = courses.find(c => c.id === ID);
    if(!course) {
        return res.status(404).send({
            message:"course with the given id does not exist"
        });
    }

    // Delete the course
    // return the deleted course
    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);
})

function validateCourse(course) {
    const schema = {
        name : Joi.string().min(4).required
    }
    return Joi.validate(course, schema);
}

app.listen(PORT, () => console.log(`server is running on port:${PORT}`));