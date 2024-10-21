//Import classes from mongodb module
import { MongoClient, ServerApiVersion } from 'mongodb';

//Set up client for connection to localhost.
const connectionURI = "mongodb://127.0.0.1:27017?retryWrites=true&w=majority";
const client = new MongoClient(connectionURI, { 
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
}); 

//Use client to create database and collection
const database = client.db("Coursework2");
export const collection = database.collection("userdatabase");

//Returns all users in database
export async function getAllUsers() {
    try {
        const results = await collection.find({}).toArray();
        return results || []; // Ensure results is always an array
    } catch (error) {
        console.error("Error fetching users:", error);
        return []; // Return empty array in case of error
    }
}

//Adds new user to database
export async function addUser(newUser){
    const result =  await collection.insertOne(newUser);
    if(result.acknowledged)
        return 1;
    throw "Failed to add customer";
}
