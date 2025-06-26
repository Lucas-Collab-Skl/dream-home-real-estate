"use client";

import Image from "next/image";
import Card from "@/components/Card";
import { useEffect } from "react";

const metadata = [{
  title: "Dream Home Real Estate",
  description: "Find your dream home with us!",
  imageUrl: "/house.jpg"
},
{
  title: "Dream Home Real Estate",
  description: "Find your dream home with us!",
  imageUrl: "/house.jpg"
},
{
  title: "Dream Home Real Estate",
  description: "Find your dream home with us!",
  imageUrl: "/house.jpg"
},
{
  title: "Dream Home Real Estate",
  description: "Find your dream home with us!",
  imageUrl: "/house.jpg"
},
];

export default function Home() {
  useEffect(() => {
    fetch("http://localhost:3000/api/oracleConnection")
      .then((response) => {
        console.log(response);
      });
    }, []);


  return (
    <>
      <h1>hi</h1>
      <div className="justify-items-center grid grid-cols-1 lg:grid-cols-3 gap-4">
        {metadata.map((house, index) => (
          <Card title={house.title}
            description={house.description}
            imageUrl={house.imageUrl} />
        ))}
      </div>
    </>
  );
}
