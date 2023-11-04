import express from 'express';
//Imports superhero json files
import superheroInfoData from './superhero_info.json';
import superheroPowersData from './superhero_powers.json';
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");

//Express application
const app = express();
const port = 3000;

// Set up middleware for security
app.use(helmet()); // Helmet helps secure your Express apps by setting various HTTP headers
app.use(bodyParser.json()); // Parse JSON request bodies

// Implement rate limiting to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});
app.use('/api/', apiLimiter);


// Setting up front-end code
app.use('/', express.static('static'));

// Superhero_info app
app.get('/api/superhero_info', (req, res) => {
    res.json(superheroInfoData);
});

// Superhero_powers app
app.get('/api/superhero_powers', (req, res) => {
    res.json(superheroPowersData);
});

//Get all superhero information for a given ID
app.get('/api/superhero-info/:id',(req, res) => {
    const superheroId = req.params.id

    const superhero = superheroInfoData.find((hero) => hero.id === superheroId)

    if(!superhero){
        return res.status(404).json ({error : "No hero found"})
    }

    res.json(superhero)

})

// Get all powers for a given superhero ID
app.get('/api/superhero-powers/:id', (req, res) => {
    const superheroId = req.params.id;

    const superhero = superheroPowersData.find((powers) => powers.id === superheroId);

    if (!superhero) {
        return res.status(404).json({ error: "Superhero not found" });
    }

    res.json(superhero.powers);
});

// Retrieve publisher information
app.get('/api/superhero_info/:publisher', (req, res) => {
    const publishers = (new Set(superheroInfoData.map(hero => hero.publisher)))

    if (!publishers) {
        return res.status(404).json({ error: "Publisher not found" });
    }

    res.json(publishers);
});

// Get the first n number of matching superhero IDs for a given search pattern matching a given information field
app.get('/api/superheroes_info/search', (req, res) => {
    const searchPattern = req.query.pattern;
    const searchField = req.query.field;
    const n = req.query.n ? parseInt(req.query.n) : undefined;

    // Filter superheroes based on the search criteria
    const matchingSuperheroes = superheroInfoData.filter(superhero => {
        const field = superhero[searchField].toLowerCase();
        return field.includes(searchPattern.toLowerCase());
    });

    // Extract superhero IDs from the matching superheroes
    const matchedSuperheroIds = matchingSuperheroes.map(superhero => superhero.id);

    // Return the first n results or all matches if n is not specified
    const limitedResults = n ? matchedSuperheroIds.slice(0, n) : matchedSuperheroIds;

    res.json(limitedResults);
});

//List variable
const customLists = {}


//Create new lists with input validation
app.post('/api/custom-lists', (req, res) => {
    const listName = req.body.name;
    const description = req.body.description;

    // Validate input to prevent injection attacks and unwanted side effects
    if (typeof listName !== 'string' || typeof description !== 'string') {
        return res.status(400).json({ error: 'Invalid input data' });
    }
    
    // Create a new custom list object with a name, description, and an empty array to hold elements.
    const newList =  {
        listName,
        description,
        elements: [] // Initialize an empty array for elements
    };
    
    // Add the new list to your custom lists data structure 
    customLists[listName] = newList
    
    // Return a success response.
    res.json({ message: 'New custom list is created' });
});

//Save a list of superhero IDs to a given custom list
app.get('/api/custom-lists/:listName/superhero-ids', (req, res) => {
    const listName = req.params.listName;
    const list = customLists[listName]
    
    // Check if the custom list exists
    //if it doesn't exist
    if (!list) {
        return res.status(404).json({ error: `Custom list '${listName}' not found` });

    } 

    res.json(list.elements)

    //Success message
    res.json({message: 'Superhero Ids are saved to the new list'})
    
});

//Get the list of superhero IDS for a custom list
app.get('/api/custom-lists/:listName/superhero-ids',(req,res)=>{
    const listName = req.params.listName
    const list = customLists[listName]

    //Check if list exists
    if(!list){
        return res.status(404).json({ error: 'The list: is not found'})
    }

    //Return the superhero IDS from the custom list
    const superheroIds = list.elements
    res.json(superheroIds)
})


// Delete a custom list and include precaution for side effects
app.delete('/api/custom-lists/:listName', (req, res) => {
    const listName = req.params.listName;

    // Validate the listName to prevent unintended side effects
    if (typeof listName !== 'string') {
        return res.status(400).json({ error: 'Invalid input data' });
    }
    
    // Check if the custom list exists
    if (customLists[listName]) {
        //deletes list
        delete customLists[listName];
        res.json({ message: `Custom list '${listName}' has been removed` });
    } else {
        // If the list doesn't exist, return an error.
        res.status(404).json({ error: `List not found` });
    }
});

//Get all hero info in a custom list
app.get('/api/custom-lists/:listName/superheroes',(req,res) => {
    const listName = req.params.listName;
    const list = customLists[listName]

    //Check if list exists
    if (!list){
        return res.status(404).json({ error: 'list not found'})
    }

    const superheroIds = list.elements

    //Find superheroes in superheroInfoData based on IDs
    const superheroesInList = superheroInfoData.filter(superhero => 
    superheroIds.includes(superhero.id))

    //Include powers for the heroes
    const heroesWithPowers = superheroInfoData.map(superhero => {
        const powers = superheroPowersData.find(power => power.id === superhero.id)
        return {
            id: superhero.id,
            name: superhero.name,
            information: superhero.information,
            powers: powers ? powers.powers : [],
        }
    })
    res.json(heroesWithPowers)
})

// Define a route to detect the language of text
app.post('/api/detect-language', (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text field is empty' });
    }

    try {
        const language = detect(text);
        res.json({ language });
    } catch (error) {
        res.status(500).json({ error: 'Language detection failed' });
    }
});

//200 Successful code
app.get('/success', (req, res) => {
    res.send('Success!'); // Status code 200 is automatically set
});

// Handle 404 Error
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

//Port Listener
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});