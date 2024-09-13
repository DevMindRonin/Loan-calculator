import express from "express"

const router = express.Router()

const BASE_RATE = 0.069
const INSURANCE_FEE_WITH = 1000
const INSURANCE_FEE_WITHOUT = 0

router.post("/", (req, res) => {
  const { amount, months, insurance } = req.body

  const monthlyInterestRate = BASE_RATE / 12
  const insuranceFee = insurance ? INSURANCE_FEE_WITH : INSURANCE_FEE_WITHOUT

  const monthlyPayment = ((amount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -months))) + insuranceFee

  res.json({ monthlyPayment: monthlyPayment.toFixed(2) })
})

export default router
