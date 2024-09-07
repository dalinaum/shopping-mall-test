import { createRef, SyntheticEvent, useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil"
import { useNavigate } from "react-router-dom"
import CartItem from "./item"
import { CartType } from "../../graphql/cart"
import { checkedCartState } from "../../recoils/cart"
import WillPay from "../willPay"

const CartList = ({ items }: { items: CartType[] }) => {
    const navigate = useNavigate()
    // 전역 상태 관리
    const [checkedCartData, setCheckedCartData] = useRecoilState(checkedCartState)
    const formRef = useRef<HTMLFormElement>(null)
    const checkboxRefs = items.map(() => createRef<HTMLInputElement>())
    const [formData, setFormData] = useState<FormData>()

    const enabledItems = items.filter(item => !item.product.createdAt)

    const setAllCheckedFromItems = () => {
        // 개별 아이템 선택시
        if (!formRef.current) return
        const data = new FormData(formRef.current)
        const selectedCount = data.getAll('select-item').length
        const allChecked = (selectedCount === enabledItems.length)
        formRef.current.querySelector<HTMLInputElement>('.select-all')!.checked = allChecked
    }

    const setItemCheckedFromAll = (targetInput: HTMLInputElement) => {
        // select all 선택시 
        const allChecked = targetInput.checked
        checkboxRefs.filter(inputElem => {
            return !inputElem.current!.disabled
        }).forEach(ref => {
            ref.current!.checked = allChecked
        })
    }

    const handleCheckboxChanged = (e?: SyntheticEvent) => {
        if (!formRef.current) return
        const targetInput = e?.target as HTMLInputElement
        if (targetInput && targetInput.classList.contains('select-all')) {
            setItemCheckedFromAll(targetInput)
        } else {
            setAllCheckedFromItems()
        }
        const data = new FormData(formRef.current)
        setFormData(data)
    }

    const handleSubmit = () => {
        if (checkedCartData.length) {
            navigate('/payment')
        } else {
            alert('결제할 대상이 없어요')
        }
    }

    useEffect(() => {
        checkedCartData.forEach(item => {
            const itemRef = checkboxRefs.find(ref => ref.current!.dataset.id === item.id)
            if (itemRef) itemRef.current!.checked = true
        })
        setAllCheckedFromItems()
    }, [])

    useEffect(() => {
        const checkedItems = checkboxRefs.reduce<CartType[]>((result, ref, i) => {
            if (ref.current!.checked) result.push(items[i])
            return result
        }, [])
        setCheckedCartData(checkedItems)
    }, [items, formData])

    return (
        <div>
            <form ref={formRef} onChange={handleCheckboxChanged}>
                <label>
                    <input className="select-all" name="select-all" type="checkbox" />
                    전체선택
                </label>
                <ul className="cart">
                    {items.map((item, i) => (
                        <CartItem {...item} key={item.id} ref={checkboxRefs[i]} />
                    ))}
                </ul>
            </form>
            <WillPay submitTitle="결제창으로" handleSubmit={handleSubmit} />
        </div>
    )
}

export default CartList
