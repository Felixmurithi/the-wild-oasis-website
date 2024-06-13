"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  console.log(nationalID);

  if (!/^[a-zA-Z_$][a-zA-Z\d_$]{5,11}$/.test(nationalID))
    throw new Error("please provide a valid national Id");

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  revalidatePath("/account/path");
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("you must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  revalidatePath("/account/reservations");
}
export async function updateReservation(formData) {
  const session = await auth();
  if (!session) throw new Error("you must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const bookingId = formData.get("bookingId");
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(Number(bookingId)))
    throw new Error("You are not allowed to update this booking");

  const numGuests = formData.get("numGuests");
  const observations = formData.get("observations").slice(0, 1000);

  const { error } = await supabase
    .from("bookings")
    .update({ numGuests, observations })
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/reservations");
  redirect("/account/reservations", "replace");
}
export async function createReservation(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("you must be logged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extraPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou", "replace");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}
export async function signOutAction() {
  await signOut("google", { redirectTo: "/" });
}
