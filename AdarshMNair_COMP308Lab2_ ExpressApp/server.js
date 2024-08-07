const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/student');

const app = express();
const port = 3000;
const URI = "mongodb+srv://a4aadhi1999:Adarshm315@studentdataapi.hdn64tg.mongodb.net/?retryWrites=true&w=majority"

const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.send('Student Data API!');
});
//get all students
app.get('/students',async(req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).json({students});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})     
    }
});
//add student
app.post('/students', async (req, res) => {
    
    try {
        const student = await Student.create(req.body);
        res.status(200).json({student});
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
        
    }
});
//find student by id
app.get('/students/:id', async (req, res) => {  
    try {
        const {id} = req.params;
        const student = await Student.findById(id);
        res.status(200).json({student});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
});
//find student by student number
app.get('/students/:studentNumber', async (req, res) => {
    try {
        const { studentNumber } = req.params;
        const student = await Student.findOne({ studentNumber: studentNumber });

        if (!student) {
            // Handle case when student is not found
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ student, message: 'Student found' });
    
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

  
//update studentdata
app.put('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findByIdAndUpdate(id, req.body);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const updatedStudent = await Student.findById(id);
        res.status(200).json(updatedStudent);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});
// delete studentdata
app.delete('/students/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const student = await Student.findByIdAndDelete(id);
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.status(200).json({ student, message: 'Student deleted' });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  });
  



               
        
mongoose.set("strictQuery",false);
mongoose.connect(URI).then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        console.log('Connected to MongoDB');

    }).catch(err => {
        console.log('Error: ', err.message);
    });