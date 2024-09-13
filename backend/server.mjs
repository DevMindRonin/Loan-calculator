import express from "express"
import loanCalculatorRoute from "../backend/routes/loanCalculator.mjs"
import bodyParser from "body-parser"
import cors from "cors"

const app = express()
const port = 3001

app.use(cors())
app.use(bodyParser.json())
app.use("/api/calculate", loanCalculatorRoute)

app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`)
})
