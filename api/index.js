const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose');
const Employee = require('./Employee')
const Attendance = require('./Attendence');
const moment = require("moment");
const app = express()
const cors = require('cors');
app.use(cors({ origin: '*' }));
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
mongoose.connect('mongodb://127.0.0.1:27017/EMPLOYEE').then(() => { console.log("connected") }).catch((e) => {
  console.log(e);
})
app.post("/addEmployee", async (req, res) => {
  try {
    const {
      employeeName,
      employeeId,
      designation,
      phoneNumber,
      dateOfBirth,
      joiningDate,
      activeEmployee,
      salary,
      address,
    } = req.body;

    const newEmployee = new Employee({
      employeeName,
      employeeId,
      designation,
      phoneNumber,
      dateOfBirth,
      joiningDate,
      activeEmployee,
      salary,
      address,
    });

    await newEmployee.save().then(() => console.log("success add employee"));
    res.status(201)
      .json({ message: "Employee saved successfully", employee: newEmployee });

  } catch (error) {
    console.log("Error creating employee", error);
    res.status(500).json({ message: "Failed to add an employee" });
  }
});

app.get("/employees", async (req, res) => {

  try {
    console.log("ihibf")
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve the employees" });
  }
});

app.post("/attendance", async (req, res) => {
  try {
    const { employeeId, employeeName, date, status } = req.body;

    const existingAttendance = await Attendance.findOne({ employeeId, date });

    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();
      res.status(200).json(existingAttendance);
    } else {
      const newAttendance = new Attendance({
        employeeId,
        employeeName,
        date,
        status,
      });
      await newAttendance.save();
      res.status(200).json(newAttendance);
    }
  } catch (error) {
    res.status(500).json({ message: "Error submitting attendance" });
  }
});

app.get("/attendance", async (req, res) => {
  try {
    const { date } = req.query;
    const attendanceData = await Attendance.find({ date: date });
    res.status(200).json(attendanceData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance data" });
  }
});

app.get("/attendance-report-all-employees", async (req, res) => {
  try {
    const { month, year } = req.query;
    console.log("Query parameters:", month, year);
    const startDate = moment(`${year}-${month}-01`, "YYYY-MM-DD")
      .startOf("month")
      .toDate();
    const endDate = moment(startDate).endOf("month").toDate();

   
    const report = await Attendance.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: [
                  { $month: { $dateFromString: { dateString: "$date" } } },
                  parseInt(req.query.month),
                ],
              },
              {
                $eq: [
                  { $year: { $dateFromString: { dateString: "$date" } } },
                  parseInt(req.query.year),
                ],
              },
            ],
          },
        },
      },

      {
        $group: {
          _id: "$employeeId",
          present: {
            $sum: {
              $cond: { if: { $eq: ["$status", "present"] }, then: 1, else: 0 },
            },
          },
          absent: {
            $sum: {
              $cond: { if: { $eq: ["$status", "absent"] }, then: 1, else: 0 },
            },
          },
          halfday: {
            $sum: {
              $cond: { if: { $eq: ["$status", "halfday"] }, then: 1, else: 0 },
            },
          },
          holiday: {
            $sum: {
              $cond: { if: { $eq: ["$status", "holiday"] }, then: 1, else: 0 },
            },
          },
        },
      },
      {
        $lookup: {
          from: "employees", 
          localField: "_id",
          foreignField: "employeeId",
          as: "employeeDetails",
        },
      },
      {
        $unwind: "$employeeDetails", 
      },
      {
        $project: {
          _id: 1,
          present: 1,
          absent: 1,
          halfday: 1,
          name: "$employeeDetails.employeeName",
          designation:"$employeeDetails.designation",
          salary: "$employeeDetails.salary",
          employeeId: "$employeeDetails.employeeId",
        },
      },
    ]);

    res.status(200).json({ report });
  } catch (error) {
    console.error("Error generating attendance report:", error);
    res.status(500).json({ message: "Error generating the report" });
  }
});

app.get("/attendence-report",async (req,res)=>{
  console.log("hihi")
  const {date}=req.query 
  const report = await Attendance.aggregate([
    {
      $match: {
        date: date
      }
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: null, 
        total: { $sum: "$count" }, 
        statuses: { $push: { status: "$_id", count: "$count" } } 
      }
    },
    {
      $project: {
        _id: 0, 
        total: 1, 
        statuses: 1 
      }
    }
  ]);
  res.status(200).json({ report });
  console.dir(report, { depth: null })
})

app.get("/attendence-info",async (req,res)=>{
  const {date}=req.query 
  console.log(date)
  const report = await Attendance.aggregate([
    {
      $match: {
        date: date
      }
    },{
      $group:{
        _id:"$status",
        names:{$push:"$employeeName"}
      }
    }
  ])
  console.log(report)
  res.status(200).json(report);
})

app.listen(2000, () => {
  console.log("server is running")
}) 