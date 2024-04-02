const app = require('./app');
const dotenv = require('dotenv');

// Handling uncaught Exceptions
process.on("uncaughtException",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down due to uncaught exception`);
    process.exit(1);
})

// Handling Unhandled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down due to unhandled rejection`);
    process.exit(1);
})

// Config
dotenv.config({path:"./Config/config.env"});

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server running on https://hostpc:${process.env.PORT}`);
})