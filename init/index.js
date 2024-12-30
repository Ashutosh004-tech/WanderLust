const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
let initData = require("../init/data.js");

let Mongo_url = "mongodb://127.0.0.1:27017/Wandelust";

main()
.then(res=>{
    console.log("Successfully Connect");
}).catch(
    err => console.log(err)
);

async function main() {
  await mongoose.connect(Mongo_url);
}

const initDb = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"676a722cecaf9bc62e556a56"}));
    await Listing.insertMany(initData.data);
}

initDb();