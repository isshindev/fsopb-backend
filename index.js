const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());
const morgan = require('morgan');
morgan.token("content", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :method :url :status :response-time ms - :res[content-length] :content"));

let people = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]
app.get('/info', (req, res) => {
    const msg = `
    Phonebook has info for ${people.length} people
    <br>
    Stat ${new Date()}
    `;
    res.send(msg);
});

app.get('/api/people', (req, res) => {
    res.json(people);
});

app.get('/api/people/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = people.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.sendStatus(404);
    }
});

app.delete('/api/people/:id', (req, res) => {
    const id = Number(req.params.id);
    people = people.filter(p => p.id !== id);
    res.sendStatus(204);
});

app.post('/api/people', (req, res) => {
    const newPerson = { ...req.body, id: generateId() };
    const person = people.find(p => p.name === newPerson.name);
    if (person) {
        res.status(409).send(error(newPerson.name + " already exists"));
    } else {
        if (!newPerson.name) {
            res.status(422).send(error("Name is missing"));
        } else if (!newPerson.number) {
            res.status(422).send(error("Number is missing"));
        } else {
            people = people.concat(newPerson);
            res.json(newPerson);
        }
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});

function generateId() {
    return Math.random(1000000) * 1000000;
}

function error(message) {
    return { error: message };
}