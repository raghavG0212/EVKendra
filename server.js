const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors= require('cors');
const mongoDB= require('./database/connectDB');
const PORT = process.env.PORT || 4000;
const path = require('path');

//middlewares
dotenv.config();
app.use(express.json());
app.use(cors());

//database
mongoDB();

//routes
app.use("/api/v1/admin", require("./routes/admin.route"));
app.use('/api/v1/voter',require('./routes/voter.route'));
app.use('/api/v1/election',require('./routes/election.route'));

// //deploying
// app.use(express.static(path.join(__dirname,'/client/dist')));
// app.get('*',(req,res)=>{
//   res.sendFile(path.join(__dirname,'client','dist','index.html'));
// });


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.bgCyan);
});
