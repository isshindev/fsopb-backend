const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const morgan = require('morgan');
morgan.token("content", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :method :url :status :response-time ms - :res[content-length] :content"));

const Person = require('./models/Person');

app.get('/info', (req, res, next) => {
    Person.count().then(count => {
        const msg = `
        Phonebook has info for ${count} people
        <br>
        Stat ${new Date()}
        `;
        res.send(msg);
    })
        .catch(err => next(err));
});

app.get('/api/people', (req, res) => {
    Person.find({}).then((people) => {
        res.json(people);
    });

});

app.get('/api/people/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            next(err);
        });
});

app.delete('/api/people/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => { res.sendStatus(204); })
        .catch(err => next(err));
});

app.post('/api/people', (req, res, next) => {
    const body = req.body;
    if (!body) {
        res.status(400).json(error('content missing'));
    }

    if (!body.name) {
        res.status(422).send(error("Name is missing"));
    } else if (!body.number) {
        res.status(422).send(error("Number is missing"));
    } else {
        const person = Person({ ...body });
        person.save().then(savedPerson => {
            res.json(savedPerson);
        }).catch(err => next(err));
    }
});

app.put("/api/people/:id", (req, res, next) => {
    const body = req.body;

    const person = {
        name: body.name,
        number: body.number
    };

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => { res.json(updatedPerson); })
        .catch(err => next(err));
});

const unknownEndpoint = (req, res) => {
    res.status(404).send(error('unknown endpoint'));
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === "CastError") {
        return res.status(400).send(error("malformatted id"));
    }
}
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});

function error(message) {
    return { error: message };
}