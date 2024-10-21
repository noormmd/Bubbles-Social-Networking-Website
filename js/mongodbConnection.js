import { MongoClient, ServerApiVersion } from 'mongodb';

// Connection URI for MongoDB
const connectionURI = "mongodb://127.0.0.1:27017?retryWrites=true&w=majority";

// Create a new MongoClient instance
const client = new MongoClient(connectionURI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
});

// Function to connect to the MongoDB database
async function connectToDatabase() {
    try {
        // Check if the client's topology is not null (indicating it's connected)
        if (!client.topology || !client.topology.isConnected()) {
            // Connect to the MongoDB database
            await client.connect();
            console.log("Successfully connected to MongoDB");
        }
    } catch (error) {
        console.error("Failure to connect to MongoDB:", error);
    }
}


// Export the MongoDB client and the connectToDatabase function
export { client, connectToDatabase };

// Function to find documents in the collections
async function find() {
    try {
        // Connect to the database if not already connected
        await connectToDatabase();

        // Specify the query (empty for fetching all documents)
        const query = {};

        // Find documents in both collections and return the results
        const [bubbles, userDatabase] = await Promise.all([
            client.db("Coursework2").collection("bubbles").find(query).toArray(),
            client.db("Coursework2").collection("userdatabase").find(query).toArray()
        ]);

        // Return the results
        return { bubbles, userDatabase };
    } catch (error) {
        console.error("Error while finding documents:", error);
        throw error; // Return error message when prompted
    }
}

// Export the find function
export { find };
