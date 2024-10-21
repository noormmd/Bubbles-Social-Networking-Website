import express from 'express';
import bodyParser from "body-parser";
import { client, connectToDatabase } from "./mongodbConnection.js";
import session from 'express-session';
import { addUser } from './database.js';
import Joi from 'joi'; // Import Joi for data validation
import multer from 'multer'; // Multer for file uploads
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Create an Express application
const app = express();
const PORT = 3000; // Default port


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware for session management
const sessionConfig = {
    name: 'cookie',
    secret: "ABC",
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
};
app.use(session(sessionConfig));

// Connect to MongoDB and start server
connectToDatabase()
    .then(() => {
        // Database and collection initialisation
        const db = client.db('Coursework2');
        const usersCollection = db.collection('userdatabase');
        const friendRequestsCollection = db.collection('friendrequests');

        // Route to fetch all users
        app.get('/M00917263/users', async (request, response) => {
            try {
                const db = client.db('Coursework2'); // Access the database
                const usersCollection = db.collection('userdatabase'); // Access the users collection

                // Fetch all users from the database
                const allUsers = await usersCollection.find().toArray();

                // Return the list of users as a response
                response.status(200).json(allUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
                response.status(500).json({ message: 'Server error' });
            }
        });

        // Define schema for user registration data
        const userSchema = Joi.object({
            username: Joi.string().alphanum().min(3).max(30).required(),
            nickname: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        });

        // Route for user registration, posting details
        app.post(`/M00917263/register`, async (req, res) => {
            try {
                // Validate user registration data against the schema
                const { error, value } = userSchema.validate(req.body);

                // Check for validation errors
                if (error) {
                    return res.status(400).json({ message: error.details[0].message }); // Send validation error message
                }

                // Formatting of registering user details
                const db = client.db('Coursework2');
                const collection = db.collection('userdatabase');
                const { username, nickname, email, password } = value; // Use validated data
                const user = { username, nickname, email, password };
                await collection.insertOne(user);
                // Return successful message
                res.status(201).json({ message: 'User registered successfully' });

            } catch (error) {
                console.error('Error in registration:', error);
                res.status(500).json({ message: 'Server error' }); // 500 for server errors, return error message
            }
        });

        // Route for user login, posting login details
        app.post(`/M00917263/login`, async (req, res) => {
            // Validations, must have email and password
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.status(400).json({ message: 'A valid Email and Password are required' });
                }
                // Collections and database of users
                const db = client.db('Coursework2');
                const collection = db.collection('userdatabase');
                // Check password against entered email
                const user = await collection.findOne({ email: email });
                // Validations, if password of user doesn't match inputted email, then return error
                if (user) {
                    if (user.password === password) {
                        req.session.user = user;
                        return res.status(200).json({ message: 'Login successful', username: user.username });
                    } else {
                        return res.status(401).json({ message: 'Invalid credentials' });
                    }
                } else {
                    return res.status(401).json({ message: 'User not found' });
                }
                // Error handling for server errors
            } catch (error) {
                console.error('Error during login:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        });

        // Accessing all users and retrieving data
        // Set up application to handle POST requests sent to the users path
        app.post('/M00917263/users', async (request, response) => {
            try {
                // Output the data sent to the server
                const newUser = request.body;
                console.log("Data received: " + JSON.stringify(newUser));
                // Add user to database
                await addUser(newUser);
                // Finish off the interaction.
                response.json({ result: 'User added successfully' });
            } catch (error) {
                console.error('Error adding user:', error);
                response.status(500).json({ error: 'Failed to add user' });
            }
        });

        // Route for sending friend requests
        app.post('/M00917263/sendFriendRequest', async (req, res) => {
            try {
                // Accessing friend requests collection
                const friendRequestsCollection = db.collection('friendRequests');

                // Sender, is currently logged in user, whilst receiver is username where follow request is made
                const { receiverUsername } = req.body;
                const senderUsername = 'currentLoggedInUser'; // Supposed to be replaced with actual sender username

                const existingRequest = await friendRequestsCollection.findOne({ sender: senderUsername, receiver: receiverUsername });

                // Error handling
                if (existingRequest) {
                    return res.status(400).json({ error: 'Friend request already sent' });
                }

                await friendRequestsCollection.insertOne({ sender: senderUsername, receiver: receiverUsername, status: 'pending' });
                res.status(200).json({ message: 'Friend request sent successfully' });
            } catch (error) {
                console.error('Error sending friend request:', error);
                res.status(500).json({ error: 'Server error' });
            }
        });

        // Collection of all user posts
        const postsCollection = db.collection('bubbles');

        // Multer setup for handling file uploads
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads/');
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            },
        });

        //Using multer for uploading image posts
        const upload = multer({ storage: storage });

        // Uploading an image post
        app.post('/M00917263/uploadImagePost', upload.single('image'), async (req, res) => {
            try {
                const caption = req.body.caption;
                const imageURL = req.file.path; // path indicates the path of the image to be posted
                // Save the post to the database
                await postsCollection.insertOne({ type: 'image', caption: caption, imageURL: imageURL });
                res.status(201).json({ message: 'Image post uploaded successfully' });
            } catch (error) {
                // Or indicate error
                console.error('Error uploading image post:', error);
                res.status(500).json({ error: 'Failed to upload image post' });
            }
        });

        // Route for uploading text posts
        app.post('/M00917263/uploadTextPost', async (req, res) => {
            try {
                const text = req.body.text;
                // Save the post to the database
                await postsCollection.insertOne({ type: 'text', text: text });
                res.status(201).json({ message: 'Text post uploaded successfully' });
            } catch (error) {
                // Or prompt error message depending on server error
                console.error('Error uploading text post:', error);
                res.status(500).json({ error: 'Failed to upload text post' });
            }
        });

        // Route for retrieving all posts
        app.get('/M00917263/posts', async (req, res) => {
            try {
                // Retrieve all posts from collection of all user posts
                const allPosts = await postsCollection.find().toArray();
                res.status(200).json(allPosts);
            } catch (error) {
                // Or indicate error
                console.error('Error fetching posts:', error);
                res.status(500).json({ error: 'Failed to fetch posts' });
            }
        });

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }) // MongoDB Connection failure, return following message
    .catch(error => {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    });

export { app };
