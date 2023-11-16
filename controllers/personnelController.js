const moment = require('moment');
const { MongoClient } = require('mongodb');
const mongoURI = 'mongodb+srv://MoinSultan:moinsultan123@cluster0.bkhbvex.mongodb.net/';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });


async function personnelInfoController(req, res)
{
    try {
      // Access the "Personnel" collection in your database
      const db = client.db('Reports');
      const personnelCollection = db.collection('Personnel');
  
      // Fetch personnel data
      const personnelData = await personnelCollection.find({}).toArray();
      console.log(personnelData,'personnelData')
      // Send the fetched data as JSON response
      res.status(200).json(personnelData);
    } catch (error) {
      console.error('Error fetching personnel data:', error);
      res.status(500).json({ error: 'An error occurred while fetching personnel data.' });
    }
}
  
async function personnelMonthlyStatusController(req, res)
{
    console.log(req.query.egNumber,'req.query.egNumber')
    console.log('/personnelMonthlyStatus')
    
      // Access the "PersonnelDailyStatus" collection in your database
    const db = client.db('Reports');
    const personnelMonthlyStatusCollection = db.collection('PersonnelDailyStatus');
    console.log(req.query,'req.query for monthly')
    const { egNumber, date } = req.query;
    const egNumberInt = parseInt(egNumber,10)
    console.log(date,'date')
    // Assuming 'date' is in the format MM/YYYY (e.g., "07/2023")
    var [month, year] = date.split('/');
    console.log(month,'month')
    console.log(year,'year')
  
    const monthMappings = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
  
    month = monthMappings.indexOf(month)+1
    if (month < 10)
    {
      month = `0${month}`
    }
  
    // year = year.slice(-2)
    console.log('Month new:', month);
    console.log('Year new:', year);
    const firstDayOfMonth = moment(`${year}-${month}-01`);
  const lastDayOfMonth = firstDayOfMonth.clone().endOf('month');
  
  
  const startOfMonth = firstDayOfMonth.format('YYYY-MM-DD');
  const endOfMonth = lastDayOfMonth.format('YYYY-MM-DD');
  
    console.log('Start of Month:', startOfMonth);
    console.log('End of Month:', endOfMonth);
  
  var start = parseInt(startOfMonth.split('-')[2])
  var end = parseInt(endOfMonth.split('-')[2])
  
  console.log('start', start);
  console.log('end', end);
  
  var personnelMonthlyStatusData = []
  
  for (var i = start; i <= end; i++)
  {
    if (i < 10)
    {
      i = `0${i}`
    }
    var dateForQuery = `${i}/${month}/${year}`
    dateForQuery = dateForQuery.toString()
    console.log(dateForQuery,'dateForQuery')
    console.log(egNumberInt,'egNumberInt')
    const query = {
      EGNumber: egNumberInt, // Add your EGNumber filter here if needed
      Date: '30/07/23'
    }
  
    console.log(query,'query')
  
  
    var personnelMonthlyStatus = await personnelMonthlyStatusCollection.find(query).toArray();
    personnelMonthlyStatusData.push(personnelMonthlyStatus)
    console.log(personnelMonthlyStatusData,'personnelMonthlyStatusData')
  }
  
  if (personnelMonthlyStatusData.length > 0) {
        res.json(personnelMonthlyStatusData);
      } else {
        res.status(404).json({ message: 'Status data not found' });
      }
}

async function personnelDailyStatusController(req, res)
{
    console.log('in personnelDailyStatus')
    // Access the "PersonnelDailyStatus" collection in your database
    const db = client.db('Reports');
    const personnelDailyStatusCollection = db.collection('PersonnelDailyStatus');
    console.log(req.query,'req.query')
    const egNumber = req.query.egNumber;
    var dateFromRequest = req.query.date
    const egNumberInt = parseInt(egNumber,10)
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
    console.log(date,'date')
    console.log(month,'month')
    console.log(year,'year')
  
  var personnelDailyStatusData = null
  
  const query = {
        EGNumber: egNumberInt, // Add your EGNumber filter here if needed
        Date: `${formattedDate}`
      }
    
    console.log(query,'query')
  
  
  personnelDailyStatusData = await personnelDailyStatusCollection.find(query).toArray();
  
    console.log(personnelDailyStatusData,'personnelDailyStatusData')
    
  if (personnelDailyStatusData) {
    res.json(personnelDailyStatusData);
  } else {
    res.status(404).json({ message: 'Status data not found' });
  }
  
}

async function addPersonnelDailyStatusController(req, res)
{
    try {
        // Extract data from the request body
        const { identifier, date } = req.query;
        console.log(identifier,'identifier')
        console.log(date,'date')

        const newStatus = req.body.status
        console.log(newStatus,'newStatus')


        const db = client.db("Reports");
        const collection = db.collection('PersonnelDailyStatus');

        // Define the filter to find the record
        const filter = { EqptRegNumber: identifier, Date: date };

        // Define the update operation
        const update = {
        $set: { StatusCode: newStatus },
        };

        // Perform the upsert operation
        const result = await collection.updateOne(filter, update, { upsert: true });

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

async function personnelStatusInMonthRangeController(req, res)
{

    const db = client.db("Reports");
    const collection = db.collection('PersonnelDailyStatus');

    const { year, startMonth, endMonth } = req.query;

    console.log(year, 'year')    
    console.log(startMonth,'startMonth')
    console.log(endMonth,'endMonth')

  // const startDateString = `01/${startMonth}/${year}`; // Converting start and end months to the "DD/MM/YYYY" format
  // const endDateString = `31/${endMonth}/${year}`;

  // try {
  //   const reportData = await collection.aggregate([
  //     {
  //       $match: {
  //         Date: {
  //           $gte: startDateString,
  //           $lte: endDateString,
  //         },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: {
  //           Status: '$StatusCode',
  //         },
  //         count: { $sum: 1 },
  //       },
  //     },
  //   ]);

  //   const formattedReportData = {};

  //   reportData.forEach((entry) => {
  //     const { _id, count } = entry;
  //     const { Status } = _id;
  //     formattedReportData[Status] = count;
  //   });
  //   console.log(formattedReportData,'formattedReportData')
  //   res.json(formattedReportData);
  // } catch (error) {
  //   console.error('Error fetching report data:', error);
  //   res.status(500).json({ error: 'An error occurred while fetching data' });
  // }
}

module.exports = {personnelInfoController, personnelMonthlyStatusController, personnelDailyStatusController, addPersonnelDailyStatusController, personnelStatusInMonthRangeController}