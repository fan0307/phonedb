const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//schema is the structure and the rule that is define so that data insert into it will be of that types
//A database schema is a blueprint or architecture of how our data will look

//in mongodb first it came database than collections then documents
//where collection is like row in sql and documents fields is like column data in sql

//where  Mongoose model provides an interface to the database for creating, querying, updating, deleting records, etc.

const PhoneSchema = new Schema({
  maker: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  AKA:{
    type:String,
    required: false
  },
  carrier: {
    type: String,
    required: true,
  },  
  esn: {
    type: String,
    required: true
  },
  barcode:{
    type:String,
    required: true
  },
  PhRmLoc:{
    type:String,
    required: false
  },
  CurLoc:{
    type:String,
    required: false
  },
  Received_Date:{
    type:String,
    required: false
  },
  Received_Items:{
    type:String,
    required: false
  },
  Inventory_Status:{
    type:String,
    required: true
  },
  Expected_Return:{
    type:String,
    required: false
  },      
  Actual_Return:{
    type:String,
    required: false
  }, 
  To_China_Date:{
    type:String,
    required: false
  }, 
  Who_Bring_Over:{
    type:String,
    required: false
  },
  Bring_Over_Items:{
    type:String,
    required: false
  },  
  China_Return:{
    type:String,
    required: false
  },   
  Note:{
    type:String,
    required: false
  },
},  //this will auto update the timestamp when we do inserting or updating documents of this type schema
{ timestamps: true });

const Phone = mongoose.model('Phone', PhoneSchema);
module.exports = Phone;

/*at first we make a schema that define structure and then created model based on that schema in 33 by 
  passing 2args 1st is singular name of collection then the schema that define structure for that object */

  //and finally exporting that User models which is later used to do CRUD operation