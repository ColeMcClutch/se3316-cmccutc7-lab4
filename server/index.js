import express from 'express';
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { stringify } from 'querystring';

//Express application
const app = express();
const port = 3000;

// Define the MongoDB connection URL and options
const dbUrl = 'mongodb://localhost/superheroes_db';
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to the MongoDB database
mongoose.connect(dbUrl, dbOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  // Define Mongoose models for superhero information and powers
const SuperheroInfo = mongoose.model('SuperheroInfo', new mongoose.Schema({
    id: String,
    name: String,
    publisher: String,
    race: String
  }));
  
  const SuperheroPowers = mongoose.model('SuperheroPowers', new mongoose.Schema({
    id: String,
    powers: [String],
  }));


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

  
//Mongoose models
app.get('/api/superhero_info/:id', async (req, res) => {
    try {
      const superhero = await SuperheroInfo.findOne({id: req.params.id});
      res.json(superhero);
    } catch (error) {
      console.error('Error fetching superheroes:', error);
      res.status(500).json({ error: 'Failed to fetch superheroes' });
    }
  });
  
  app.get('/api/superhero_powers/:id', async (req, res) => {
    try {
      const superheroPowers = await SuperheroPowers.findOne({id: req.params.id});
      res.json(superheroPowers);
    } catch (error) {
      console.error('Error fetching superhero powers:', error);
      res.status(500).json({ error: 'Failed to fetch superhero powers' });
    }
  });

// Retrieve publisher information
app.get('/api/superhero_info/:publisher', async (req, res) => {
    try{
    const publishers = await SuperheroInfo.distinct('publisher')
    res.json(publishers);
    } catch (error){
        console.error('Error fetching publishers:', error)
        res.status(500).json({ error: 'Failed to fetch publishers' });
    }
});

// Get the first n number of matching superhero IDs for a given search pattern matching a given information field
app.get('/api/superheroes_info/search', async (req, res) => {
    const { field, pattern, n } = req.query
    try{
        // Filter superheroes based on the search criteria
        const pattern = new RegExp(pattern, 'i')
        const query = { [field]: { $regex: regexPattern} };        
        const matchedSuperheroes = await SuperheroInfo.find(query).limit(parseInt(n)||0)
        res.json(matchedSuperheroes.map(hero => hero.id));
    } catch (error){
        console.error('Error searching for superheroes:', error);
        res.status(500).json({ error: 'Failed to search for superheroes' });     
    }
});


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