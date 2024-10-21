// Import database code that we are testing
import { app }  from '../server.js';

// Import Chai library
import * as chai from 'chai';

// Import Chai-Http for making HTTP requests
import chaiHttp from 'chai-http';

// Use Chai-Http plugin
chai.use(chaiHttp);

// Set up Chai assertion styles
const should = chai.should();
const assert = chai.assert;
const expect = chai.expect;

// Import database code that we are testing
import * as db from '../server.js';

// Import axios for making HTTP requests
import axios from 'axios';

// Wrapper for all database tests
describe('Database', () => {

    // Test getAllUsers method in database
    describe('#getAllUsers', () => {
        // Increase the timeout for this test case to 10000ms (10 seconds)
        it('should return all of the users in the database', async () => {
            // Make GET request to fetch all users
            const response = await axios.get('http://localhost:3000/users');
            const results = response.data;

            // Check that results is defined and is an array
            assert.isDefined(results);
            assert.isArray(results);

            // Check user properties if results is not empty
            if (results.length > 0) {
                // Assuming each user has 'name' and 'age' properties
                assert.property(results[0], 'nickname');
                assert.property(results[0], 'nickname');
            }
        }).timeout(10000); // Set timeout to 10000ms (10 seconds)
    });

    // Test addUser method in database
    describe('#addUser', () => {
        it('should add a user to the database', async () => {
            // Create random user details
            const userName = Math.random().toString(36).substring(2, 15);
            const userAge = 1;

            // Call function to add user to database
            let result = await db.addUser({ name: userName, age: userAge });
            assert.strictEqual(result, 1);

            // Use MongoDB Client to check user is in database
            result = await db.collection.find({ name: userName }).toArray();
            assert.lengthOf(result, 1);

            // Clean up database
            result = await db.collection.deleteOne({ name: userName });
            assert.strictEqual(result.deletedCount, 1);
        });
    });
});
