
require('dotenv').config({ path: '.env' });
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./Routes/userRoutes');


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');




const app = express();
var cors = require('cors');
const adminRouter = require('./Routes/adminRoutes');
const middlewares = require('./middlewares/middlewares');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(middlewares.createAdmin)
app.use(userRouter);
app.use(adminRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connection established...🔗");
    app.listen(process.env.PORT, () => {
      console.log(`Server running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("❌❌ Error connecting to server ❌❌", err));
