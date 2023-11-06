//Imports
const nodeStorage = require('node-storage')
const rateLimit =  require('express-rate-limit')
const helmet =  require ('helmet')

// Prepare Storage
const store = new nodeStorage("superheroes/lists.json");

//Express application
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('client'));

const superheroInfo = require("./superheroes/superhero_info.json")
const superheroPowers = require("./superheroes/superhero_powers.json")


// Set up middleware for security
app.use(helmet()); // Helmet helps secure your Express apps by setting various HTTP headers
app.use(express.json()); // Parse JSON request bodies
// Setting up front-end code
app.use('/', express.static('../client'));

// Implement rate limiting to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});
app.use('/api/', apiLimiter);

  
//retrieve data from the given json files
app.get('/api/superheroes/superhero_info/:id', (req, res) => {
    try {
      const superhero = superheroInfo.find((hero) => hero.id == req.params.id);
      res.json(superhero);
    } catch (error) {
      console.error('Error fetching superheroes:', error);
      res.status(500).json({ error: 'Failed to fetch superheroes' });
    }
  });
  
  app.get('/api/superheroes/superhero_powers/:id', (req, res) => {
    try {
      const superhero = superheroInfo.find((hero) => hero.id == req.params.id);
      const heroPowers = superheroPowers.find((power) => power.hero_names == superhero.name)
      if(heroPowers == undefined){
        res.status(404).send("hero powers not found")
      }
      else{
      res.json(heroPowers);
      }
    } catch (error) {
      console.error('Error fetching superhero powers:', error);
      res.status(500).json({ error: 'Failed to fetch superhero powers' });
    }
  });

// Retrieve publisher information
app.get('/api/superheroes/publisher_info',  (req, res) => {
    res.json([...new Set(superheroInfo.map((hero) => hero.Publisher))]);
    });

// Get the first n number of matching superhero IDs for a given search pattern matching a given information field
app.get('/api/superheroes/superhero_search',  (req, res) => {
    try{
        const { field, pattern, n } = req.query
        // Filter superheroes based on the search criteria
        const regexPattern = new RegExp(pattern, 'i');
        const matchedSuperheroes = superheroInfo.filter((hero) =>regexPattern.test(hero[field])).slice(0, parseInt(n) || superheroInfo.length);
        res.json(matchedSuperheroes.map(hero => hero.id));
    } catch (error){
        console.error('Error searching for superheroes:', error);
        res.status(500).json({ error: 'Failed to search for superheroes' });     
    }
});



//Create new lists with input validation
app.post('/api/superheroes/new-lists', (req, res) => {
    const listName = req.body.name;
    const description = req.body.description;

    // Validate input to prevent injection attacks and unwanted side effects
    if (typeof listName !== 'string' || typeof description !== 'string') {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    if (store.get(listName)) {
      return res.status(400).json({ error: 'Custom list name already exists' });
    }
    
    // Create a new custom list object with a name, description, and an empty array to hold elements.
    const newList =  {
        listName,
        description,
        elements: [] // Initialize an empty array for elements
    };
    
    // Add the new list to your custom lists data structure 
    store.put(listName, newList);
    
    // Return a success response.
    res.json({ message: 'New custom list is created' });
});

//Save a list of superhero IDs to a given custom list
app.post('/api/superheroes/custom-Idlists/:listName', (req, res) => {
    const listName = req.params.listName;
    const list = store.get(listName)
    const superheroIds = req.body.superheroIds
    
    // Check if the custom list exists
    //if it doesn't exist
    if (!list) {
        return res.status(404).json({ error: `Custom list '${listName}' not found` });

    } 

    list.elements = superheroIds

    //Success message
    res.json({message: 'Superhero Ids are saved to the new list'})
    
});

//Get the list of superhero IDS for a custom list
app.get('/api/superheroes/custom/:listName/superhero-ids',(req,res)=>{
    const listName = req.params.listName
    const list = store.get(listName)

    //Check if list exists
    if(!list){
        return res.status(404).json({ error: 'The list: is not found'})
    }

    //Return the superhero IDS from the custom list
    const superheroIds = list.elements
    res.json(superheroIds)
})


// Delete a custom list and include precaution for side effects
app.delete('/api/superheroes/lists/:listName', (req, res) => {
    const listName = req.params.listName;

    // Validate the listName to prevent unintended side effects
    if (typeof listName !== 'string') {
        return res.status(400).json({ error: 'Invalid input data' });
    }
    
    // Check if the custom list exists
    if (store.get(listName)) {
        //deletes list
        delete store.get(listName);
        res.json({ message: `Custom list '${listName}' has been removed` });
    } else {
        // If the list doesn't exist, return an error.
        res.status(404).json({ error: `List not found` });
    }
});

//Get all hero info in a custom list
app.get('/api/superheroes/c-l/:listName/superheroes',  (req,res) => {
    const listName = req.params.listName;
    const list = store.get(listName)

    //Check if list exists
    if (!list){
        return res.status(404).json({ error: 'list not found'})
    }

    const superheroIds = list.elements

  
    //Include powers for the heroes
    try{ 
      const superheroes =  superheroInfo.find({ id: { $in: superheroIds } });
      const powers =  superheroPowers.find({ id: { $in: superheroIds } });
    
      const heroesWithPowers =  superheroes.map(superhero => {
        const superheroPowers =  powers.find(power => power.id === superhero.id)
        return {
            id: superhero.id,
            name: superhero.name,
            information: superhero.information,
            powers: superheroPowers ? superheroPowers.powers : [],
        }
    })
    res.json(heroesWithPowers)
  } catch (error) {
      console.error('Error fetching superheroes:', error);
      res.status(500).json({ error: 'Failed to fetch superheroes' });
    }
})

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