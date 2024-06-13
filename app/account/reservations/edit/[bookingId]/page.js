import UpdateReservationForm from "@/app/_components/UpdateReservationFormp";
import { getBooking, getSettings } from "@/app/_lib/data-service";

export default async function Page({ params }) {
  const { bookingId } = params;
  const { maxGuestPerBooking } = await getSettings();
  const { numGuests, observations } = await getBooking(bookingId);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>
      <UpdateReservationForm
        bookingId={bookingId}
        maxGuestPerBooking={maxGuestPerBooking}
        numGuests={numGuests}
        observations={observations}
      />
    </div>
  );
}
