const express = require("express");
const userRoutes = require('./routes/userRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const adminRouter = require('./routes/adminRouter')
const {notFound,errorHandler} = require('./middlewares/errorMiddleware');
const PORT = process.env.PORT || 5000;
const app = express();
const db = require('./config/connection');
const cors =  require('cors');
require('dotenv').config();


// console.log(db);

app.use(express.json());
db.connect((err)=>{
    if(err) console.log('connection error' + err);
    else console.log('Databse connected to port 27017');
})

app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
        methods:"GET,POST"

    })
)

app.use('/user',userRoutes);
app.use('/teacher',teacherRoutes);
app.use('/admin',adminRouter);


app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});