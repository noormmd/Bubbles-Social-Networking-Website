//Import database code that we are testing
import * as db from '../database.js';

//Set up Chai library 
import { should, assert, expect } from 'chai';

//Wrapper for all database tests
describe('Database', () => {

    //Test getAllUsers method in database
    describe('#getAllUsers', () => {
        it('should return all of the users in the database', async () => {
            // Call function we are testing - depends on database server running
            const results = await db.getAllUsers();
    
            // Check that results is defined and is an array
            assert.isDefined(results);
            assert.isArray(results);
    
            // Check user properties if results is not empty
            if (results.length > 0) {
                assert.containsAllKeys(results[0], ['nickname', 'email']);
            }
        });
    });
    

    //Test addUser method in database
    describe('#addUser', () => {
        it('should add a user to the database', async () => {
            //Create random user details
            const userName = Math.random().toString(36).substring(2, 15);
            const userAge = 1;

            //Call function to add user to database
            let result = await db.addUser({name: userName, age: userAge});
            expect(result).to.equal(1);

            //Use MongoDB Client to check user is in database
            result = await db.collection.find({name: userName}).toArray();
            expect(result.length).to.equal(1);

            //Clean up database
            result = await db.collection.deleteOne({name: userName});
            expect(result.deletedCount).to.equal(1);
        });
    });
});
