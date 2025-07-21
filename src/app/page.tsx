"use client";

import Image from "next/image";
import axios from "axios";
import Card from "@/components/Card";
import { useEffect, useState } from "react";
import { useUser } from "./userContext";
import { Property } from "@/app/types";

export default function Home() {
 
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await axios.get("/api/list?table=property");
      console.log("Properties fetched:", response.data.tableList);
      setProperties(response.data.tableList);
    };
    fetchProperties();
  }, []);


  return (
    <>
      <div className="justify-items-center grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {properties &&
          properties.map((property, index) => (
            <Card key={property.propertyNo} title={`${property.street}, ${property.city}, ${property.postalCode}`}
              description={`${property.type} - ${property.rooms} rooms, $${property.rent} rent`}
              imageUrl="/house.jpg" />
          ))}
      </div>
    </>
  );
}
