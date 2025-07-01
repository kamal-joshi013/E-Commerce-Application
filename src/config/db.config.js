import { MongoClient, ObjectId } from "mongodb";

let client;
export const connectToMongoDB = () => {
  MongoClient.connect(process.env.DB_URL)
    .then((clintInstance) => {
      client = clintInstance;
      console.log("MongoDB is connected");
      createCounter(client.db());
    })
    .catch((err) => console.log(err));
};
export const getClint=()=>{
  return client;
}
export const getDB = () => {
  return client.db();
};

const createCounter =async(db)=>{
   const  existCounter = await db.collection("Counter").findOne({_id:"cartItemId"});
   if(!existCounter){
    await db.collection("Counter").insertOne({_id:"cartItemId",value:0});
   }
}
