import { MongoClient } from 'mongodb';





/*
async function getUserAppointments(email) {
  const client = await MongoClient.connect('mongodb+srv://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PW + process.env.MONGODB_CONN_STR
    , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  const db = client.db('medifit');
  const collection = db.collection('randevu_detay');

  const appointments = await collection.find({ email: email }, { projection: { _id: 0 } }).toArray();


  client.close();
  return { status: 2, data: appointments };
}


async function getTrainerAppointments(email) {
  const client = await MongoClient.connect('mongodb+srv://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PW + process.env.MONGODB_CONN_STR
    , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  const db = client.db('medifit');
  const collection = db.collection('randevu_detay');

  const appointments = await collection.find({ trainerEmail: email }, { projection: { _id: 0 } }).toArray();


  client.close();
  return { status: 2, data: appointments };
}




async function addNewAppointment(appointment) {
  const client = await MongoClient.connect('mongodb+srv://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PW + process.env.MONGODB_CONN_STR
    , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  const db = client.db('medifit');
  const collection = db.collection('randevu_detay');

  console.log(["HEYYY", appointment])
  //const existingDocument = await collection.findOne({ email: document.email });
  //if (existingDocument) {
  //  console.log('Document already exists');
  //  client.close();
  //  return {status: 1, data: existingDocument};
  //}

  //document.completed = [];
  //document.arcadeCompleted = [];
  //document.lastCompleted = 0;
  //document.joinedOn = new Date();
  await collection.insertOne(appointment);

  client.close();
  return { status: 2, data: appointment };
}



async function addNewUser(user) {
  //console.log(["HEYYY user",user])
  const client = await MongoClient.connect('mongodb+srv://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PW + process.env.MONGODB_CONN_STR
    , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  const db = client.db('medifit');
  const collection = db.collection('users');


  if (user.adminPassword !== "c38788fb98cade70a7220296d7a2b2b7cf6e211ec542e444299d73a5151475a5") {
    // admin password is incorrect
    client.close();
    return { status: -2, data: {} };
  }

  const users = await collection.find({ "email": user.email }).toArray();
  if (users.length > 0) { // user email exists
    client.close();
    return { status: -1, data: {} };
  }
  delete user.adminPassword
  await collection.insertOne(user);

  client.close();
  return { status: 2, data: user.email };
}

*/
async function getClusterData(cluster) {
  //console.log(["HEYYY user",user])
  const client = await MongoClient.connect('mongodb+srv://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PW + process.env.MONGODB_CONN_STR
    , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  const db = client.db('etymallogy_clusters');
  const collection = db.collection('cluster_data');




  const clusters = await collection.find({ "cid": cluster.cid }).toArray();
  console.log(clusters);

  client.close();
  if (clusters.length > 0) { // clusters found
    return { status: 2, clusterData: clusters };
    // return { status: -3, data: {} };
  }else{
    return { status: -3, clusterData: {} };
  }
 
 
}







export {  getClusterData }