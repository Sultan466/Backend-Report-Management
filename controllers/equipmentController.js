const { MongoClient } = require('mongodb');
const mongoURI = 'mongodb+srv://MoinSultan:moinsultan123@cluster0.bkhbvex.mongodb.net/';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function equipmentDailyStatusController(req, res)
{
    const db = client.db('Reports');
    const equipmentDailyStatusCollection = db.collection('EquipmentDailyStatus');
  
    var eqptRegNumber = req.query.eqptRegNumber;
    var dateFromRequest = req.query.date
    console.log(eqptRegNumber,'eqptRegNumber ')

    console.log(dateFromRequest,'dateFromRequest')

    try {

        var splittedDateArray = dateFromRequest.split('-')
        var date = parseInt(splittedDateArray[2])
        if (date < 10)
        {
          date = `0${date}`
        }
        var month = parseInt(splittedDateArray[1])
        if (month < 10)
        {
          month = `0${month}`
        }
        var year = parseInt(splittedDateArray[0])
        var formattedDate = `${date}/${month}/${year}`
        formattedDate = formattedDate.toString()
        eqptRegNumber = eqptRegNumber.toString()
        console.log(date,'date')
        console.log(month,'month')
        console.log(year,'year')
        console.log(formattedDate,'formattedDate')
        const query = {
          EqptRegNumber: eqptRegNumber,
          Date: formattedDate,
        }
        console.log(query,'query for equipment daily status')
      const equipmentDailyStatusData = await equipmentDailyStatusCollection.find(query).toArray();
      console.log(equipmentDailyStatusData,'equipmentDailyStatusData')
      if (equipmentDailyStatusData.length > 0) {
        console.log(equipmentDailyStatusData,'equipmentDailyStatusData')
        res.json(equipmentDailyStatusData);
      } else {
        res.status(404).json({ message: 'Status data not found' });
      }
    } catch (error) {
      console.error('Error fetching equipment daily status data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}

async function equipmentInfoController(req, res)
{
    try {
      // Access the "Equipment" collection in your database
      const db = client.db('Reports');
      const equipmentCollection = db.collection('Equipment');
  
      // Fetch equipment data
      const equipmentData = await equipmentCollection.find({}).toArray();
      console.log(equipmentData,'equipmentData')
      // Send the fetched data as JSON response
      res.status(200).json(equipmentData);
    } catch (error) {
      console.error('Error fetching equipment data:', error);
      res.status(500).json({ error: 'An error occurred while fetching equipment data.' });
    }
}

async function addEquipmentDailyStatusController(req, res)
{
    try {
        // Extract data from the request body
        const { identifier, date } = req.query;
        console.log(identifier,'identifier')
        console.log(date,'date')
    
        const newStatus = req.body.status
        console.log(newStatus,'newStatus')
    
        const db = client.db("Reports");
        const collection = db.collection('EquipmentDailyStatus');
    
        // Define the filter to find the record
        const filter = { EqptRegNumber: identifier, Date: date };
    
        // Define the update operation
        const update = {
          $set: { StatusCode: newStatus },
        };
    
        // Perform the upsert operation
        const result = await collection.updateOne(filter, update, { upsert: true });
        console.log(result,'result')
        if (result.matchedCount) {
          res.status(200).send('Status updated');
        } else {
          res.status(201).send('New status added');
        }
      } catch (error) {
        console.error('Error updating equipment status:', error);
        res.status(500).send('Internal Server Error');
      }
}

module.exports = {equipmentDailyStatusController, equipmentInfoController, addEquipmentDailyStatusController}