import { expect } from 'chai';
import { MongoClient } from 'mongodb';

// Import the functions from the same file
import { client, connectToDatabase, find } from '../mongodbConnection.js';

describe('Database Connection Tests', () => {
  before(async () => {
    // Connect to the database before running tests
    await connectToDatabase();
  });

  after(async () => {
    // Close the database connection after running tests
    await client.close();
  });

  it('should successfully connect to the MongoDB database', () => {
    expect(client.isConnected()).to.equal(true);
});


  it('should fetch documents from the "bubbles" and "userdatabase" collections', async () => {
    const results = await find();
    expect(results).to.be.an('array').that.is.not.empty;
  });
});
