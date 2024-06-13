import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";

// add metadata values
export async function generateMetadata({ params }) {
  const { name } = await getCabin(params.cabinid);
  return { title: `Cabin ${name}` };
}

// for generating dynamic routes, inorder to render them statically.
export async function generateStaticParams() {
  const cabins = await getCabins();
  const ids = cabins.map((cabin) => ({ cabinid: String(cabin.id) }));
  return ids;
}

export default async function Page({ params }) {
  const cabin = await getCabin(params.cabinid);
  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />
      <div>
        <h2 className="text-5xl font-semibold text-accent-400 mb-10 text-center">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
