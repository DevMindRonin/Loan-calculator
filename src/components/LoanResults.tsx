import Spinner from "./Spinner"

interface Props {
  loading: boolean
  monthlyPayment: string
}

const LoanResults: React.FC<Props> = ({ loading, monthlyPayment }) => {
  return (
    <div className="mt-4 text-center">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h3>Měsíčně zaplatíte</h3>
          <h1>{monthlyPayment}</h1>
        </>
      )}
    </div>
  )
}

export default LoanResults
