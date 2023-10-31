import express from 'express';
//Imports superhero json files
import superheroInfoData from './superhero_info.json';
import superheroPowersData from './superhero_powers.json';


const app = express();
const port = 3000;

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

// Retrieve publisher information
app.get('/api/superhero_info/:publisher', (req, res) => {
    const publisherId = req.params.publisher;

    const publisher = superheroInfoData.find(item => item.publisher === publisherId);

    if (!publisher) {
        return res.status(404).json({ error: "Publisher not found" });
    }

    res.json(publisher);
});

//Searches for ID matches
app.get('/api/superheroes_info/search', (req, res) => {
    const searchPattern = req.query.pattern;
    const searchField = req.query.field;
    const n = req.query.n ? parseInt(req.query.n) : undefined;

    //Sets search parameter
    const matchingSuperheroes = superhero_info.filter(superheroes => {
        const field = superheroes[searchField].toLowerCase();
        return field.includes(searchPattern.toLowerCase());
    });
    
    //Matches id results
    const matchedSuperheroIds = matchingSuperheroes.map(superheroes => superheroes.id);
    const limitedResults = n ? matchedSuperheroIds.slice(0, n) : matchedSuperheroIds;
    
    res.json(limitedResults);
});

//List variable
const listArray = {}


//Create new lists
app.post('/api/custom-lists', (req, res) => {
    const listName = req.body.name;
    const description = req.body.description;
    
    // Create a new custom list object with a name, description, and an empty array to hold elements.
    const newList =  {
        listName: InputDeviceInfo("Enter new list name: ")
    };
    
    // Add the new list to your custom lists data structure (e.g., an array or an object).
    listArray.json(newList)
    
    // Return a success response.
});

app.post('/api/custom-lists/:listName/add-element', (req, res) => {
    const listName = req.params.listName;
    const elementId = req.body.elementId;
    
    // Retrieve the custom list by name from your custom lists data structure.
    
    // Find the element in your source data based on the elementId.
    
    // Add the element to the custom list's "elements" array.
    
    // Return a success response.
});

app.get('/api/custom-lists', (req, res) => {
    // Return a list of custom lists, including their names and descriptions.
});


app.get('/api/custom-lists/:listName/elements', (req, res) => {
    const listName = req.params.listName;
    
    // Retrieve the custom list by name from your custom lists data structure.
    
    // Return the elements within the custom list.
});


//Port listener
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
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