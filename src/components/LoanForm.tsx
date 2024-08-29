import React, { forwardRef } from "react"
import { Controller } from "react-hook-form"

interface SliderProps {
  value: number
  min: number
  max: number
  step: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface Props {
  control: any
  errors: any
  minAmount: number
  maxAmount: number
  minMonths: number
  maxMonths: number
}

const STEP_CUR = 1000
const STEP_MON = 1

const Slider = forwardRef<HTMLInputElement, SliderProps>(({ value, min, max, step, onChange }, ref) => (
  <div className="d-flex align-items-center">
    <input
      type="range"
      className="form-range me-3"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      ref={ref}
    />
    <input
      type="number"
      className="form-control"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      step={step}
      pattern="\d+" 
      onInput={(e) => {
        const value = e.currentTarget.value;
        e.currentTarget.value = value.replace(/[^0-9]/g, "");
      }}
    />
  </div>
))

const LoanForm: React.FC<Props> = ({ control, errors, minAmount, maxAmount, minMonths, maxMonths }) => {
  return (
    <div>
      <div className="mb-3">
        <h6>Výše půjčky</h6>
        <Controller
          name="amount"
          control={control}
          rules={{
            required: "Zadej částku",
            min: { value: minAmount, message: `Částka musí být alespoň ${minAmount}` },
            max: { value: maxAmount, message: `Částka nemůže přesáhnout ${maxAmount}` }
          }}
          render={({ field }) => (
            <>
              <Slider {...field} min={minAmount} max={maxAmount} step={STEP_CUR} />
              {errors.amount && <p className="text-danger">{errors.amount.message}</p>}
            </>
          )}
        />
      </div>

      <div className="mb-3">
        <h6>Na jak dlouho (v měsících)</h6>
        <Controller
          name="months"
          control={control}
          rules={{
            required: "Zadej počet měsíců",
            min: { value: minMonths, message: `Zadej alespoň ${minMonths} měsíců` },
            max: { value: maxMonths, message: `Nelze zadat více než ${maxMonths} měsíců` }
          }}
          render={({ field }) => (
            <>
              <Slider {...field} min={minMonths} max={maxMonths} step={STEP_MON} />
              {errors.months && <p className="text-danger">{errors.months.message}</p>}
            </>
          )}
        />
      </div>

      <div className="mb-3">
        <h6>Pojistka</h6>
        <Controller
          name="insurance"
          control={control}
          render={({ field }) => (
            <div>
              <div className="form-check">
                <input
                  {...field}
                  className="form-check-input"
                  type="radio"
                  value="true"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                />
                <label className="form-check-label">S pojištěním</label>
              </div>
              <div className="form-check">
                <input
                  {...field}
                  className="form-check-input"
                  type="radio"
                  value="false"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                />
                <label className="form-check-label">Bez pojištění</label>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default LoanForm
