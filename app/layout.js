import Logo from "@/app/_components/Logo";
import Navigation from "./_components/Navigation";

import "@/app/_styles/globals.css";
import { Josefin_Sans } from "next/font/google";
import Header from "./_components/Header";
import { ReservationProvider } from "./_components/ReservationContext";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  // title: "The wild oasis",
  title: {
    template: "%s / The Wild Oasis",
    default: "Welcome / The Wild Oasis",
  },

  description:
    "Luxurious cabins hotel, located at the heart of the Italian dolomites, surrounded by beautiful cmountains ands dark forests.",
};

//how is layout.js connected to teh routes
// children displayed on change of route
// font import boiler plate
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} 
        antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col relative`}
      >
        <Header />
        <div className="flex-1 px-8 py-12 grid ">
          <main className="max-w-7xl mx-auto w-full">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
