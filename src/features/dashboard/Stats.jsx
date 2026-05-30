import { HiOutlineBanknotes, HiOutlineBriefcase, HiOutlineCalendarDateRange, HiOutlineChartBar } from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";

function Stats({ bookings, confirmedStays, numDays, cabinCount }) {

    const safeBookings = bookings ?? [];
    const safeConfirmedStays = confirmedStays ?? [];

    const numBookings = safeBookings.length;
    const sales = safeBookings.reduce(
        (acc, cur) => acc + Number(cur?.totalPrice ?? 0),
        0,
    );
    const checkins = safeConfirmedStays.length;

    const occupiedNights = safeConfirmedStays.reduce(
        (acc, cur) => acc + Number(cur?.numNights ?? cur?.numNightts ?? 0),
        0,
    );
    const occupation =
        numDays > 0 && cabinCount > 0 ? occupiedNights / (numDays * cabinCount) : 0;

    return (
        <>
            <Stat
                title='Bookings'
                color='blue'
                icon={<HiOutlineBriefcase />}
                value={numBookings} />
            <Stat
                title='Sales'
                color='green'
                icon={<HiOutlineBanknotes />}
                value={formatCurrency(sales)} />
            <Stat
                title='Check ins'
                color='indigo'
                icon={<HiOutlineCalendarDateRange />}
                value={checkins} />
            <Stat
                title='Occupancy rate'
                color='yellow'
                icon={<HiOutlineChartBar />}
                value={Math.round(occupation * 100) + '%'} />

        </>
    )
}

export default Stats
