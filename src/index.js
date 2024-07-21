import dotenv from "dotenv";
import connectDB from "./db/server.js";
import app from "./app.js";

dotenv.config({ 
    path: "./.env"
 });

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.error(`ERROR occured while starting the server: ${error}`)
        process.exit(1)
    })

    app.listen(process.env.PORT || 6500, () => {
        console.log(`Server is running on port: ${process.env.PORT || 6500}`)
        console.log(`Server is running on: http://localhost:${process.env.PORT || 6500}`)
    })

    console.log(`Database connection extablished successfully`)
})
.catch((error) => {
    console.error(`ERROR occured while connecting to the database: ${error}`)
    process.exit(1)
})