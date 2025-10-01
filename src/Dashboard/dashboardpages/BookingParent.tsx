import { useGetMeQuery } from "@/redux/features/user/userApi"
import BookingPage from "./Booking"
const BookingParent = () => {
    const {data: user} = useGetMeQuery()
    const role = user?.role ?? "USER"
  return (
    <BookingPage role={role}/>
  )
}

export default BookingParent