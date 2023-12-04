//Imports
const nodeStorage = require('node-storage')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const validator = require('validator');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const cors = require('cors');



// Prepare Storage
const store = new nodeStorage("superheroes/lists.json");
const users = new nodeStorage("users/users.json")
//Express application
const express = require('express');
const app = express();

const port = 3000;
app.use(express.static('../client'));
const superheroInfo = require('./superheroes/superhero_info.json')
const superheroPowers =require('./superheroes/superhero_powers.json')

// Set up middleware for security
app.use(helmet()); // Helmet helps secure your Express apps by setting various HTTP headers
app.use(express.json()); // Parse JSON request bodies
// Enable trust for proxy headers
app.use(cors()); // Enable CORS for all routes

app.set('trust proxy', true);
// Setting up front-end code
app.use('/', express.static('../client'));
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

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
                    superhero.power = Object.entries(matchingPowers[0]).filter(([, value]) => value === "True");
                    combinedSuperheroes.push(superhero);
                } else {
                    superhero.power = 'None'
                    combinedSuperheroes.push(superhero)
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
//Search for a hero list and set the element ids in the list to the heroes
app.post('/api/superheroes/idSearch/:listName', async (req, res) => {
    const listName = req.params.listName;
    const list = store.get("lists." + listName);
    //If list didn't exist
    if (!list) {
        return res.status(404).json({ error: `Custom list '${listName}' not found` });
    }
    try { //Checks for list elements and then begin superhero searching
        if (list.elements && list.elements.length > 0) {
            const elementsObject = list.elements.reduce((acc, element) => {
                const superhero = superheroInfo.find((hero) => hero.id == element);
                console.log(superhero)
                if (superhero) {
                    // Filter matching powers for the superhero
                    const matchingPowers = superheroPowers.filter((power) => power.hero_names == superhero.name);
                    // Extract true powers from the matching powers
                    const truePowers = matchingPowers.reduce((powers, power) => {
                        Object.entries(power).forEach(([key, value]) => {
                            if (value === 'True') {
                                powers.push(key);
                            }
                        });
                        return powers;
                    }, []);
                    // Include powers if available
                    superhero.powers = truePowers.length > 0 ? truePowers : 'none';
                    acc[element] = superhero;
                }
                return acc;
            }, {});
            //Creates new updated list variable
            const updatedList = {
                listName: list.listName,
                description: list.description,
                status: list.status,
                owner: list.owner,
                elements: elementsObject,
            };
            res.json({ updatedList });
        } else {
            res.status(500).json({ error: 'List has no elements' });
        }
    } catch (error) {
        res.status(500).json({ error: 'List has no elements' });
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
app.post('/api/superheroes/new-lists/:listName/:description/:status/:owner', (req, res) => {
    const listName = req.params.listName;
    const description = req.params.description;
    const status = req.params.status
    const owner = req.params.owner
    const rating = parseFloat(req.params.rating)
    const review = req.params.review

    // Validate input to prevent injection attacks and unwanted side effects
    if (typeof (listName) !== 'string' || typeof (description) !== 'string') {
        return res.status(400).json({ error: 'Invalid input data' });
    }
    if (store.get("lists." + listName)) {
        console.log('error here')
        return res.status(400).json({ error: 'Custom list name already exists' });
    }
    // Create a new custom list object with a name, description, and an empty array to hold elements.
    const newList = {
        listName,
        description,
        status,
        owner,
        elements: [],// Initialize an empty array for elements
        rating, 
        review
        
    };
    // Add the new list to your custom lists data structure 
    store.put("lists." + listName, newList);
    console.log(newList)
    // Return a success response.
    res.json({ message: 'New custom list is created' });
});
// Save a list of superhero IDs to a given custom list
app.post('/api/superheroes/custom-Idlists/:listName', (req, res) => {
    const listName = req.params.listName;
    const list = store.get("lists." + listName);
    const superheroIds = req.body.superheroIds;

    // Check if the custom list exists
    // If it doesn't exist, create a new list
    if (!list) {
        store.put("lists." + listName, { elements: [superheroIds] });
        return res.json({ message: 'Superhero Ids are saved to the new list' });
    }

    // Fetch existing superhero IDs from the list
    const existingSuperheroIds = list.elements;

    // Combine new superhero IDs with existing superhero IDs
    const updatedSuperheroIds = [...existingSuperheroIds, superheroIds]
    console.log(updatedSuperheroIds)

    // Update the list with the combined superhero IDs
    list.elements = updatedSuperheroIds;
    store.put("lists." + listName, list);

    // Success message
    res.json({ message: 'Superhero Ids are saved to the list' });
});

// Remove superhero IDs from a given custom list
app.delete('/api/superheroes/removeIDs/:listName', (req, res) => {
    const listName = req.body.listName;
    const list = store.get("lists." + listName);
    const superheroIds = list.elements || [];
    const removalID = req.body.removalID;

    // Check if the custom list exists
    if (!list) {
        return res.status(404).json({ error: `Custom list '${listName}' not found` });
    }

    console.log("Before removal:", superheroIds);

    // Remove the single superhero ID from the list
    console.log(removalID);

    // Use filter to create a new array excluding the removalID
    const updatedSuperheroIds = superheroIds.filter(id => id !== removalID);

    console.log("After removal:", updatedSuperheroIds);

    // Update the list with the combined superhero IDs
    list.elements = updatedSuperheroIds;
    store.put("lists." + listName, list);

    // Success message
    res.json({ message: 'Superhero Id is removed from the list' });
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

//Login/Authentication
//Verification email client FOCUS ON THIS NEXT!
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'j87126681@gmail.com',
      pass: 'fbua sbot vvpp fzsy',
    },
  });


// Local authentication mechanism - Create an account
app.post('/api/users/register', (req, res) => {
	console.log('hello')
try{
	console.log('hello')
    const { email, password, nickname } = req.body;
    // Check if email is present and is a string
	console.log(email, password,nickname)
    if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Invalid email format' });
    }
  
    // Input validation for email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format2' });
    }
  
    const user  = { email, password, nickname, disabled: false, verified: false };
   
    //If users is empty
    if(users==null){
        users.put('User: ' + user.email, user)
    } else{
        //Check if email is already registered
        if (users.get('User: ' + nickname)) {
            return res.status(400).json({ error: 'User already registered' });
        }
        // Add user to the storage
        users.put('User: ' + user.email, user)
    }   
    // Send verification email (in a real-world scenario, you would send an email with a verification link)
    
    //Sudo
    const check = verifyAccount(req, email, password, nickname)
    //if for when link is clicked
    if(check==true){ //condition for link click
    //Set user status to true verified
    user = {email, password, nickname, disabled:false, verified:true}
    }

    res.status(201).json({ message: `Account created successfully with ${email} . Welcome ${nickname}` });
    }catch (error) {
        console.error('Error fetching superheroes:', error);
    }
});
//verification function
async function verifyAccount(req, email, password, nickname) {
    try{
        const verificationToken = generateVerificationToken()
        const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}&nickname=${nickname}`;
        const mailOptions = {
            from: 'j87126681',
            to: email,
            subject: 'Verification Link',
            text: 'Hello, here is your email verification link',
            html: `<p>Please click on the following link to verify your email:</p><p><a href="${verificationLink}">${verificationLink}</a></p>`,
        }
        console.log('Verification link:', verificationLink);
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
              } else {
                console.log('Email sent:', info.response);
                return true
              }
          })      
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
    }
}
// Verification endpoint
app.get('/verify-email', (req, res) => {
    const { token, nickname, email } = req.query;
    console.log('Request parameters:', req.query);

  
    // Check if the token is valid (you should implement this validation)
    if (isValidVerificationToken(token)) {
        console.log(nickname)
      // Update the user status to verified (you should implement this logic)
      // Example using some kind of storage (assuming users is a Map)
      const user = users.get('User: ' + nickname);
      if (user) {
        user.verified = true;
        users.put('User: ' + email, user);
        res.status(200).json({ message: 'Email verified successfully' });
      }
  
      res.status(200).json({ message: 'Email verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid verification token' });
    }
  });

// Function to generate a unique verification token (you should implement this)
function generateVerificationToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  // Function to validate the verification token (you should implement this)
  function isValidVerificationToken(token) {
    return true;
  }



  // Local authentication mechanism - Login
  app.post('/api/users/login', (req, res) => {
    try{
        const { email, password, nickname } = req.body;
        console.log('hello')
  
        if(users == null){
            return res.status(401).json({error: 'No users in database'})
        }
        const user = users.get('User: ' + nickname); // Use nickname as the key
        
  
        if (!user || user.disabled==true) {
            console.log('Disabled Account. Please contact Administrator')
        return res.status(401).json({ error: 'Invalid credentials or account disabled' });
        }
        if (!user.verified==true) {
            return res.status(401).json({ error: 'Account not Verified! Please Check Email!' });
        }
  
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
  
        res.status(201).json({message: `Login successful with ${email} . Welcome ${nickname}!` })
        }catch (error) {
            console.error('Error fetching superheroes:', error);
        }
  });
  
//Account disabling
app.post('/api/users/disable', (req,res) => {
try{
    const { email, password, nickname } = req.body;
    const user = users.get('User: ' + nickname)
    if (!user) {
        return res.status(401).json({ error: 'User not found' });
    }
    
    if (user.disabled) {
        return res.status(401).json({ error: 'Account is disabled' });
    }
    user.disabled=true
    console.log(user)
    res.status(201).json({message: `Account with ${email} has been disabled. Goodbye ${nickname}!` })
    }catch (error) {
        console.error('Error fetching superheroes:', error);
    }
})
//Account disabling
app.post('/api/users/enable', (req,res) => {
    try{
        const { email, password, nickname } = req.body;
        const user = users.get('User: ' + nickname)
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        if (user.disabled) {
            return res.status(401).json({ error: 'Account is disabled' });
        }
        user.disabled=false
        console.log(user)
    
        res.status(201).json({message: `Account with ${email} has been enabled. Welcome back ${nickname}!` })
    
        }catch (error) {
            console.error('Error fetching superheroes:', error);
        }
    })

// Delete a custom list and include precaution for side effects
app.delete('/api/users/removeAccount', (req, res) => {
    const { email, password, nickname } = req.query;
    // Check if the user exists
    if (users.get("User: " + nickname)) {
            //deletes user
            users.remove("User: " + nickname);
            res.json({ message: `User ${nickname} @ ${email} has been removed` });
        
    } else {
        // If the list doesn't exist, return an error.
        res.status(404).json({ error: `user not found` });
    }
});
//Update password function
app.post('/api/users/updatePassword', (req,res) => {
    const { email, password, nickname, newPassword } = req.body;
    // Gathers user
    const userKey = 'User: ' + nickname;
    const user = users.get(userKey);
    if(user){
        user.password = newPassword
        console.log(user)
        users.put(userKey, user);       
        res.json({ message: `User ${nickname} @ ${email} has updated the password from ${password} to ${newPassword}`});
    }else {
        // If the list doesn't exist, return an error.
        res.status(404).json({ error: `user not found` });
    }
    
});

//Rate list function
app.post('/api/superheroes/rateList/:listName', (req,res) => {
    const { rating, review } = req.body;
  const listName = req.params.listName;

  // Gathers user
  const list = store.get('lists.' + listName);

  if (list) {

    if (list.rating !== undefined) {
      // If the list already has a rating, calculate the average
      const currentRating = parseFloat(list.rating);
      const newRating = parseFloat(rating);
      const averageRating = (currentRating + newRating) / 2;

      list.rating = averageRating.toFixed(1); // Keep one decimal place
    } else {
      // If the list doesn't have a rating, set the new rating and the first review
      list.rating = rating;
    }
    list.review = review


    store.put('lists.' + String(listName), list);
    res.json({ message: `list has rating of ${list.rating} - ${list.review}` });
  } else {
    // If the list doesn't exist, return an error.
    res.status(404).json({ error: `list not found` });
  }
});

app.post('/api/users/giveAdmin', (req,res) =>{
    try{
        const { email, password, nickname } = req.body;  
        if(users == null){
            return res.status(401).json({error: 'No users in database'})
        }
        const user = users.get('User: ' + nickname); // Use nickname as the key
        user.nickname='admin'

    }catch (error) {
            console.error('Unable to grant Admin Privelges:', error);
    }
})


//Get all lists
app.get('/api/superheroes/allLists', (req, res) => {
    res.send(store.get("lists"));
})
//Get all lists
app.get('/api/users/allUsers', (req, res) => {
    res.send(users.get("User"));
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
