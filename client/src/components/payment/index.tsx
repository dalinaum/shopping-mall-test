import { useRecoilState } from "recoil"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { checkedCartState } from "../../recoils/cart"
import WillPay from "../willPay"
import PaymentModal from "./modal"
import { useMutation } from "react-query"
import { graphqlFetcher } from "../../queryClient"
import { EXECUTE_PAY } from "../../graphql/payment"

type PaymentInfos = string[]

const Payment = () => {
    const navigate = useNavigate()
    const [checkedCartData, setCheckedCartData] = useRecoilState(checkedCartState)
    const [modalShown, toggleModal] = useState(false)
    const { mutate: executePay } = useMutation(
        (ids: PaymentInfos) => graphqlFetcher<PaymentInfos>(EXECUTE_PAY, { ids }))

    const showModal = () => {
        toggleModal(true)
    }

    const proceed = () => {
        const ids = checkedCartData.map(({ id }) => (id))
        executePay(ids, {
            onSuccess: () => {
                setCheckedCartData([])
                alert('결제 완료되었습니다.')
                navigate('/products', { replace: true })
            }
        })
    }

    const cancel = () => {
        toggleModal(false)
    }

    return (
        <div>
            <WillPay submitTitle="결제하기" handleSubmit={showModal} />
            <PaymentModal show={modalShown} proceed={proceed} cancel={cancel} />
        </div>
    )
}

export default Payment
