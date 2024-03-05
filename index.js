var express = require('express')
var app = express();
var router = express.Router();
app.use(express.json());
const bodyparser = require('body-parser');
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json())
var path = require('path');



var port = process.env.PORT || 8099;
app.listen(port);
console.log('app running at port toilet server: ' + port);

app.use('/', router);
app.use(express.static('web'));
app.use(express.static('web/assets'));
router.get('/', (request, response) => {
    response.sendFile(path.resolve('./web/index.html'));
})



































const feedbackModel = require('./model/feedback');
const feedbackModel2 = require('./model/feedback_w_status')
// //create feedback
app.post('/create_feedback', async (req, res) => {
  const id_string = generateId(4);
  try {
    let feedback = new feedbackModel({
      "id": id_string,
      "driver": req.body.driver,
      "star": req.body.star,
      "content": req.body.content,
      "experience": req.body.experience,
      "createdAt": req.body.createdAt,
    });
    feedbackModel.findOne({ id: feedback.id }, async function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        if (data != null) {
          res.send({ "status": false, "message": "fail create feedback", "data": null });
        } else {
          feedback.save(function (err, data) {
            if (err) {
              console.log(err)
            } else {
              console.log(err)
            }
          });
          res.send({ "status": true, "message": 'Created feedback, Thank You! ', "data": feedback });
        }
      }
    });
  } catch (error) {
    res.status(500).send({ message: `error ${message} ${error}` });
  }
});

app.put('/update_feedback', async (req, res) => {
  try {
    const feedbackID = req.body.id; // Assuming you have a field to specify the feedback ID in the request body
    // Create a new tripData object with the updated values
    const updatedTripData = tripModel({
      "driver": req.body.driver,
      "customer_name": req.body.customer_name,
      "customer_number": req.body.customer_number,
      "from": req.body.from,
      "to": req.body.to,
      "feedback_id": feedbackID,
      "createdAt": req.body.createdAt,
    });

    // Find the feedback document by its ID
    feedbackModel.findOne({ id: feedbackID }, async function (err, feedback) {
      if (err) {
        console.log(err);
        res.status(500).send({ message: `Error finding feedback: ${err}` });
      } else {
        if (!feedback) {
          res.send({ "status": false, "message": "No feedback found with the specified ID", "data": null });
          return;
        }

        // Update the feedback's trip information
        feedback.trip = updatedTripData;

        // Create a new tripModel instance with the updatedTripData
        const updatedTripModel = new tripModel(updatedTripData);

        // Save the updated tripModel
        updatedTripModel.save(async (err, savedTripModel) => {
          if (err) {
            console.log(err);
            res.status(500).send({ message: `Error updating trip: ${err}` });
          } else {
            // Save the updated feedback
            feedback.save((err, updatedFeedback) => {
              if (err) {
                console.log(err);
                res.status(500).send({ message: `Error updating feedback: ${err}` });
              } else {
                res.send({ "status": true, "message": 'Updated trip information successfully', "data": updatedFeedback });
              }
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).send({ message: `Error: ${error}` });
  }
});

app.get('/list_feedback', async (req, res) => {
  feedbackModel.find({})
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .limit(15) // Limit the results to 15 records
    .exec(function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).send({ "status": false, "message": "An error occurred" });
      } else {
        if (data == null || data.length == 0) {
          res.send({ "status": false, "message": "find list feedback fail", "totalResult": null, "data": data });
        } else {
          res.send({ "status": true, "message": "find list feedback success", "totalResult": data.length, "data": data });
        }
      }
    });
});


//LIST APP FEEDBACK WITH STATUS 
app.get('/list_feedback_status', async (req, res) => {
  feedbackModel2.find({})
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .limit(15) // Limit the results to 15 records
    .exec(function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).send({ "status": false, "message": "An error occurred " });
      } else {
        if (data == null || data.length == 0) {
          res.send({ "status": false, "message": "find list feedback with status fail", "totalResult": null, "data": data });
        } else {
          res.send({ "status": true, "message": "find list feedback with status success", "totalResult": data.length, "data": data });
        }
      }
    });
});
//CREATE APP FEEDBACK WITH STATUS
app.post('/create_feedback_status', async (req, res) => {
  const id_string = generateId(8);
  try {
    let feedback = new feedbackModel2({
      "id": id_string,
      "driver": req.body.driver,
      "star": req.body.star,
      "content": req.body.content,
      "experience": req.body.experience,
      "createdAt": req.body.createdAt,
      "isprocess": req.body.isprocess,
      "processcreateAt": req.body.processcreateAt
    });
    feedbackModel2.findOne({ id: feedback.id }, async function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        if (data != null) {
          res.send({ "status": false, "message": "fail create feedback", "data": null });
        } else {
          feedback.save(function (err, data) {
            if (err) {
              console.log(err)
            } else {
              console.log(err)
            }
          });
          res.send({ "status": true, "message": 'Created feedback, Thank You. ! ', "data": feedback });
        }
      }
    });
  } catch (error) {
    res.status(500).send({ message: `error ${message} ${error}` });
  }
});

// UPDATE FEEDBACK (isprocess and processcreateAt)
app.post('/update_feedback_status', async (req, res) => {
  try {
    const existingFeedback = await feedbackModel2.findOne({id:req.body.id});
    if (!existingFeedback) {
      return res.status(404).send({ "status": false, "message": "Feedback not found", "data": null });
    }
    if (req.body.isprocess !== undefined) {
      existingFeedback.isprocess = req.body.isprocess;
    }
    existingFeedback.processcreateAt = new Date();
    // Save the updated feedback
    await existingFeedback.save();

    return res.send({ "status": true, "message": 'Feedback was comfirmed successfully!', "data": existingFeedback });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ "status": false, "message": "Internal Server Error", "data": null });
  }
});

function generateId(length) {
  const id = crypto.randomBytes(length).toString('hex');
  return typeof id === 'string' ? id : '';
}





















app.post('/get_trip_by_id', async (req, res) => {
  try {
    const objectIdString = req.body.objectId; // Get the ObjectId string from the request body

    // Use mongoose.Types.ObjectId to convert the string into an ObjectId
    const objectId = mongoose.Types.ObjectId(objectIdString);

    // Find the tripData by its ObjectId
    tripModel.findById(objectId, (err, tripData) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: `Error finding tripData: ${err}` });
      } else {
        if (!tripData) {
          res.status(404).json({ message: 'No tripData found with the specified ObjectId' });
        } else {
          res.status(200).json({ message: 'Found tripData', data: tripData });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` });
  }
});








app.get('/list_token', async (req, res) => {
  tokenModel.find({})
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .limit(15) // Limit the results to 15 records
    .exec(function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).send({ "status": false, "message": "An error occurred" });
      } else {
        if (data == null || data.length == 0) {
          res.send({ "status": false, "message": "find list tokens fail", "totalResult": null, "data": data });
        } else {
          res.send({ "status": true, "message": "find list tokens success", "totalResult": data.length, "data": data });
        }
      }
    });
});


// POST API to add a new token
app.post('/add_token', async (req, res) => {
  const { value, name } = req.body;

  if (!value || !name) {
    return res.status(400).json({ "status": false, "message": "Both 'value' and 'name' are required fields." });
  }

  // Check for duplicate token
  const existingToken = await tokenModel.findOne({ value });
  if (existingToken) {
    return res.status(409).json({ "status": false, "message": "Token with the provided 'value' already exists." });
  }

  const newToken = new tokenModel({ value, name });

  try {
    const savedToken = await newToken.save();
    res.status(201).json({ "status": true, "message": "Token added successfully", "data": savedToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ "status": false, "message": "Failed to add token", "error": error.message });
  }
});










//EXPORT FEEDBACK
app.get('/export_feedback_all', async (req, res) => {
  const workbook = new Excel.Workbook();
  const sheet = workbook.addWorksheet('Sheet1');
  sheet.addRow(["#", "ID", "RATING STAR", "CONTENT","FEEDBACK", "DATETIME","IS_PROCESSED","PROCRESS DATETIME"]);
  try {
    const data = await feedbackModel2.find();
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'No feedback found',
        totalResult: 0,
        data: null,
      });
    }
    
    data.forEach((item, index) => {
      sheet.addRow([index + 1, item.id, item.star,item.content, item.experience, item.createdAt.toLocaleString(),item.isprocess,item.processcreateAt.toLocaleString()]);
    });
    const formattedTimestamp = functions.getFormattedTimestamp();
    const randomString = functions.generateRandomString(3); 
    const excelFileName = `feedback_history_${formattedTimestamp}_${randomString}.xlsx`; // Generate a unique file name
    const excelFolderPath = 'public/excel'; // Replace with your desired folder path for saving the Excel file
    if (!fs.existsSync(excelFolderPath)) {
      fs.mkdirSync(excelFolderPath, { recursive: true });
    }
    const excelFilePath = path.join(excelFolderPath, excelFileName); // Use an absolute path for the file path
    workbook.xlsx.writeFile(excelFilePath)
      .then(() => {
        console.log(`Excel file was saved at: ${excelFilePath}`); // Log the file location
        res.send({ "status": true, "message": "Feedback Excel file generated and saved on server", "filePath": excelFileName });
      })
      .catch((err) => {
        console.error(err);
        res.send({ "status": false, "message": "Failed to generate feedback excel file", "filePath": null });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: 'Failed to retrieve & export feedback data',
      totalResult: null,
      data: null,
    });
  }
});

//DOWNLOAD FEEDBACK
app.get('/download_excel/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const excelFolderPath = 'public/excel'; // Replace with your folder path
  // Create the full path to the Excel file
  const excelFilePath = path.join(excelFolderPath, fileName);
  // Check if the file exists
  if (fs.existsSync(excelFilePath)) {
    // Set the response headers to specify the file type and attachment
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    // Create a read stream to send the file content to the response
    const fileStream = fs.createReadStream(excelFilePath);
    console.log(`Downloading file: ${fileName}`);
    fileStream.pipe(res);
    fileStream.on('end', () => {
      console.log(`Downloaded file: ${fileName}`);
    });
  } else {
    // If the file does not exist, send a 404 response
    console.log(`File not found: ${fileName}`);
    res.status(404).send('File not found');
  }
});