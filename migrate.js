const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

// MongoDB connection URL and database name
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'phonedb'; // Replace with your database name
const collectionName = 'phones'; // Replace with your collection name

// CSV file path
const csvFilePath = 'handset_data.csv'; // Replace with your CSV file path

// Function to connect to MongoDB and insert data
const insertDataIntoMongoDB = async (data) => {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.insertMany(data);
    console.log('Data inserted into MongoDB');
  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    await client.close();
  }
};

// Read CSV file and parse data
const data = [];
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => data.push(row))
  .on('end', () => {
    console.log('CSV file successfully processed');
    insertDataIntoMongoDB(data);
  });
