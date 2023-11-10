//Imports
const nodeStorage = require('node-storage')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')

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


// Retrieve all superhero information
app.get('/api/superheroes/superhero_info', (req, res) => {
    try {
        res.json(superheroInfo);
    } catch (error) {
        console.error('Error fetching superheroes:', error);
        res.status(500).json({ error: 'Failed to fetch superheroes' });
    }
});

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

//Powers retireval 
app.get('/api/superheroes/superhero_powers/:id', (req, res) => {
	try {
		const superhero = superheroInfo.find((hero) => hero.id == req.params.id);
		const heroPowers = superheroPowers.find((power) => power.hero_names == superhero.name)
		
		if (heroPowers == undefined) {
			res.status(404).send("hero powers not found")
		}
		else {
			res.json(heroPowers);
		}
	} catch (error) {
		console.error('Error fetching superhero powers:', error);
		res.status(500).json({ error: 'Failed to fetch superhero powers' });
	}
	
});


//Info and power  combination 
app.get('/api/superheroes/superhero_combined/:id', (req, res) => {
	try {
 		const superhero = superheroInfo.find((hero) => hero.id == req.params.id);
		 if (!superhero) {
			res.status(404).send("Superhero not found");
			return;
		}
		const name = superhero.name;
		var power = []
		console.log(name)
		for (const [key, value] of Object.entries(superheroPowers)){
	
			if(value.hero_names == name){
				power = value
			}
		}
		for (const [key, value] of Object.entries(power)) {
			if (value === "True") {
				superhero[key] = value
			}
		}
		res.status(200).send(superhero)
	}
	catch{
		res.status(500).json({ error: 'Failed to fetch superhero powers' });
	}
})



app.get('/api/superheroes/search_and_combined', async (req, res) => {
    try {
        const { field, pattern, n } = req.query;

        // Search for superheroes based on field and pattern
        const regexPattern = new RegExp(pattern, 'i');
        const filteredSuperheroes = superheroInfo.filter((hero) => {
            if (field === "power") {
                for (const power of superheroPowers) {
                    for (const key in power) {
                        if (regexPattern.test(key) && power[key] === "True") {
                            return true;
                        }
                    }
                }
                return false;
            } else {
                return regexPattern.test(hero[field]);
            }
        });

        const matchedSuperheroes = filteredSuperheroes.slice(0, parseInt(n));

        // Collect the IDs of matched superheroes
        const superheroIds = matchedSuperheroes.map((hero) => hero.id);

        // Combine superhero info and powers for each ID
        const combinedSuperheroes = [];
        for (const id of superheroIds) {
            const superhero = superheroInfo.find((hero) => hero.id == id);
            if (superhero) {
                const name = superhero.name;
                let matchingPowers = superheroPowers.filter((power) => power.hero_names == name);
				if (matchingPowers && matchingPowers.length > 0) {
					matchingPowers = matchingPowers.map((power) => power[0]);
					superhero.powers = Object.entries(matchingPowers[0]).map((power) => power[1] === "True");
					combinedSuperheroes.push(superhero);
				} else {
					console.error(`No matching powers found for superhero with name: ${name}`);
				}
				
            }
        }

        res.json(combinedSuperheroes);
    } catch (error) {
        console.error('Error searching and combining superheroes:', error);
        res.status(500).json({ error: 'Failed to search and combine superheroes' });
    }
});



// Retrieve publisher information
app.get('/api/superheroes/publisher_info', (req, res) => {
	res.json([...new Set(superheroInfo.map((hero) => hero.Publisher))]);
});

// Get the first n number of matching superhero IDs for a given search pattern matching a given information field
app.get('/api/superheroes/superhero_search', (req, res) => {
	let filteredSuperheroes = []
	let matchedSuperheroes = []
	try {
		const { field, pattern, n } = req.query
		// Filter superheroes based on the search criteria
		const regexPattern = new RegExp(pattern, 'i');
		if(field==="power"){
			superheroPowers.forEach((hero)=>{
				for(power in hero){
					if(regexPattern.test(power)){
						if(hero[power] == "True"){
							const matchedHero = superheroInfo.filter((infoHero) =>  infoHero.name == hero["hero_names"])
							if (matchedHero[0] == undefined) {
								continue
							}
							matchedSuperheroes.push(matchedHero[0])
						}
					}

				}
			})
		} else{
			filteredSuperheroes = superheroInfo.filter((hero) => regexPattern.test(hero[field]))
			console.log(filteredSuperheroes)
			matchedSuperheroes = filteredSuperheroes.slice(0, parseInt(n) || superheroInfo.length);
			console.log(matchedSuperheroes)
		}
		//console.log(matchedSuperheroes)
		res.json(matchedSuperheroes.map(hero => hero.id));
	} catch (error) {
		console.error('Error searching for superheroes:', error);
		res.status(500).json({ error: 'Failed to search for superheroes' });
	}
});



//Create new lists with input validation
app.post('/api/superheroes/new-lists/:listName/:description', (req, res) => {
	const listName = req.params.listName;
	const description = req.params.description;

	// Validate input to prevent injection attacks and unwanted side effects
	if (typeof (listName) !== 'string' || typeof (description) !== 'string') {
		return res.status(400).json({ error: 'Invalid input data' });
	}

	if (store.get("lists." + listName)) {
		return res.status(400).json({ error: 'Custom list name already exists' });
	}

	// Create a new custom list object with a name, description, and an empty array to hold elements.
	const newList = {
		listName,
		description,
		elements: [] // Initialize an empty array for elements
	};

	// Add the new list to your custom lists data structure 
	store.put("lists." + listName, newList);

	// Return a success response.
	res.json({ message: 'New custom list is created' });
});

//Save a list of superhero IDs to a given custom list
app.post('/api/superheroes/custom-Idlists/:listName', (req, res) => {
	const listName = req.params.listName;
	const list = store.get("lists." + listName)
	const superheroIds = req.body.superheroIds

	// Check if the custom list exists
	//if it doesn't exist
	if (!list) {
		return res.status(404).json({ error: `Custom list '${listName}' not found` });

	}

	list.elements = superheroIds
	store.put("lists." + listName, list)

	//Success message
	res.json({ message: 'Superhero Ids are saved to the new list' })

});

//Get the list of superhero IDS for a custom list
app.get('/api/superheroes/custom/:listName/superhero-ids', (req, res) => {
	const listName = req.params.listName
	const list = store.get("lists." + listName)

	//Check if list exists
	if (!list) {
		return res.status(404).json({ error: 'The list: is not found' })
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
	if (store.get("lists." + listName)) {
		//deletes list
		store.remove("lists." + listName);
		res.json({ message: `Custom list '${listName}' has been removed` });
	} else {
		// If the list doesn't exist, return an error.
		res.status(404).json({ error: `List not found` });
	}
});

//Get all hero info in a custom list
app.get('/api/superheroes/c-l/:listName/superheroes', (req, res) => {
	const listName = req.params.listName;
	const list = store.get("lists." + listName);

	//Check if list exists
	if (!list) {
		return res.status(404).json({ error: 'list not found' })
	}

	const superheroIds = list.elements;

	let heroArray = [];

	//Include powers for the heroes
	try {

		superheroIds.forEach(element => {
			const elementHeroInfo = superheroInfo.find((hero) => hero.id == element);
			const elementHeroPowers = superheroPowers.find((power) => power.hero_names == elementHeroInfo.name);

			elementHeroInfo.powers = elementHeroPowers;

			heroArray.push(elementHeroInfo);
		});

		res.json(heroArray)
	} catch (error) {
		console.error('Error fetching superheroes:', error);
		res.status(500).json({ error: 'Failed to fetch superheroes' });
	}
})

//Get all lists
app.get('/api/superheroes/allLists', (req, res) => {
	res.send(store.get("lists"));
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