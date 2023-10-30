const express = require('express');
const fs = require('fs');
const app = express()
const port = 3000;


//Setting up front-end code
app.use('/', express.static('static'));

//Superhero_info app
app.get('/api/superhero_info', (req,res)=> {
    fs.readFile('superhero_info.json', (err, data) => {
        if (err) {
          res.status(500).send('Error reading the JSON file');
        } else {
          const infoData = JSON.parse(data);
          res.json(jsonData);
        }
})
})

//Superhero_powers app
app.get('/api/superhero_powers', (req,res)=> {
    fs.readFile('superhero_powers.json', (err, data) => {
        if (err) {
          res.status(500).send('Error reading the JSON file');
        } else {
          const infoData = JSON.parse(data);
          res.json(powersData);
        }
})
})

//retrieves publisher information
app.get('/api/superhero_info/:publisher', (req, res) => {
    const publisherId = req.params.id;
    const publisher = data.find(item => item.id === publisherId);

    if (!publisher) {
        return res.status(404).json({ error: "Publisher not found" });
    }

    res.json(publisher);
});