require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(reqult => {
        console.log('connected to MongoDB');
    })
    .catch(err => {
        console.log('error connecting to MongoDB: ', err.message);
    });

const schema = new mongoose.Schema({
    name: String,
    number: String,
})
schema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Person = mongoose.model('Person', schema);
module.exports = Person;



