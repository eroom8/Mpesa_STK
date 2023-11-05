const express = require('express');
const cors = require('cors');
const app = express();
const stkRouter = require('./routes/stk'); 
require('dotenv').config();
const port = process.env.LOCAL_PORT;


// Configure CORS
const corsOptions = {
  origin: "*", 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the STK router for STK-related routes
app.use(stkRouter);
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
