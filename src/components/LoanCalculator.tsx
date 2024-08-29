import { useEffect, useReducer } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "./LoanCalculator.css"
import LoanForm from "./LoanForm"
import LoanResults from "./LoanResults"

interface FormValues {
  amount: number
  months: number
  insurance: boolean
}

type Action =
  { type: "SET_MONTHLY_PAYMENT"; payload: string | null } |
  { type: "SET_INSURANCE_COST"; payload: string } |
  { type: "SET_LOADING"; payload: boolean }

interface State {
  monthlyPayment: string | null
  insuranceCost: string
  loading: boolean
}

const MIN_AMOUNT = 50000
const MAX_AMOUNT = 1500000
const MIN_MONTHS = 24
const MAX_MONTHS = 120
const AVAILABILITY = "Neplatné hodnoty"
const INS_INIT = "0 Kč/měsíčně"
const INS_PLUS = "1000 Kč/měsíčně"

const initialState: State = {
  monthlyPayment: AVAILABILITY,
  insuranceCost: INS_INIT,
  loading: false,
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_MONTHLY_PAYMENT":
      return { ...state, monthlyPayment: action.payload }
    case "SET_INSURANCE_COST":
      return { ...state, insuranceCost: action.payload }
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

const LoanCalculator: React.FC = () => {
  const { handleSubmit, control, watch, formState: { errors, isValid } } = useForm<FormValues>({
    defaultValues: {
      amount: MIN_AMOUNT,
      months: MIN_MONTHS,
      insurance: false,
    },
    mode: "onChange",
  })

  const [state, dispatch] = useReducer(reducer, initialState)

  const calculatePayment = async (data: FormValues) => {
    switch (true) {
      case (data.amount < MIN_AMOUNT || data.amount > MAX_AMOUNT || data.months < MIN_MONTHS || data.months > MAX_MONTHS):
        dispatch({ type: "SET_MONTHLY_PAYMENT", payload: AVAILABILITY })
        return
    }
  
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const response = await axios.post("/api/calculate", data)
      const monthlyPaymentValue = Math.round(response.data.monthlyPayment)
  
      const paymentDisplay = monthlyPaymentValue < 0 ? AVAILABILITY : `${monthlyPaymentValue} Kč`
  
      dispatch({ type: "SET_MONTHLY_PAYMENT", payload: paymentDisplay })
      dispatch({ type: "SET_INSURANCE_COST", payload: data.insurance ? INS_PLUS : INS_INIT })
    } catch (error) {
      dispatch({ type: "SET_MONTHLY_PAYMENT", payload: AVAILABILITY })
    }
    dispatch({ type: "SET_LOADING", payload: false })
  }

  useEffect(() => {
    calculatePayment({
      amount: MIN_AMOUNT,
      months: MIN_MONTHS,
      insurance: false,
    })

    const subscription = watch((value) => {
      if (isValid) {
        calculatePayment(value as FormValues)
      } else {
        dispatch({ type: "SET_MONTHLY_PAYMENT", payload: AVAILABILITY })
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, isValid])

  const onSubmit = (data: FormValues) => {
    if (isValid) {
      calculatePayment(data)
    }
  }

  return (
    <div className="card p-4 mx-auto mt-5 custom-card">
      <h1 className="text-center mb-4">Hypoteční kalkulačka</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LoanForm
            control={control}
            errors={errors}
            minAmount={MIN_AMOUNT}
            maxAmount={MAX_AMOUNT}
            minMonths={MIN_MONTHS}
            maxMonths={MAX_MONTHS}
          />
        <LoanResults loading={state.loading} monthlyPayment={state.monthlyPayment || AVAILABILITY} />        
        <div className="d-flex justify-content-center mt-3">
          <button type="submit" className="btn btn-primary fw-bold">POKRAČOVAT</button>
        </div>
      </form>
      <p className="small text-muted mt-3 text-center">
        Úroková sazba od 6.90%, RPSN od 7.11%, pojištění {state.insuranceCost}. Celkem zaplatíte 
        <span className="fw-bold"> {state.monthlyPayment ? parseInt(state.monthlyPayment) * watch("months") : "0"} </span>Kč
      </p>
    </div>
  )
}

export default LoanCalculator
