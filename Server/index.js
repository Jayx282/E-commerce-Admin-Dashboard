import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import morgan from "morgan"
import bodyParser from "body-parser"
import helmet from "helmet"
import clientRoutes from "./routes/client.js"
import managementRoutes from "./routes/management.js"
import salesRoutes from "./routes/sales.js"
import generalRoutes from "./routes/general.js"

import User from "./models/User.js";
import Product from "./models/Product.js"
import ProductStat from "./models/ProductStat.js"
import Transaction from "./models/Transaction.js"
import OverallStat from "./models/OverallStat.js"
import AffiliateStat from "./models/AffiliateStat.js"
import { dataUser ,
    dataProduct ,
    dataProductStat ,
    dataTransaction ,
    dataOverallStat ,
    dataAffiliateStat
} from "./data/index.js"

dotenv.config();
const app = express();
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}))
app.use(cors())
app.use(morgan("common"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

app.use("/client" , clientRoutes);
app.use("/sales", salesRoutes);
app.use("/management",managementRoutes)
app.use("/general", generalRoutes)

const PORT = process.env.PORT || 9000 ;
mongoose.connect(process.env.MONGO_URL , {
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(() => {
    app.listen(PORT, () => console.log(`server port : ${PORT}`));

    // Product.insertMany(dataProduct);
    // ProductStat.insertMany(dataProductStat);
    // User.insertMany(dataUser)
    // Transaction.insertMany(dataTransaction)
    // OverallStat.insertMany(dataOverallStat)
    // AffiliateStat.insertMany(dataAffiliateStat)
}).catch((error) => console.log(`${error} did not connect`));
