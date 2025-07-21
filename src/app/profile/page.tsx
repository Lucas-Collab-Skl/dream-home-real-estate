"use client";

import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/app/userContext";
import { addToast, Input, NumberInput } from "@heroui/react";

export default function Profile() {
    const { user, updateUser, isLoading } = useUser();
    const [photo, setPhoto] = useState<string | Blob | null>(null);

    const getPhoto = async () => {

        // check if user has image
        try {

            // send image to backend
            const res = await axios.get("/api/auth?staffNo=" + user?.staffNo);
            console.log("Photo fetched successfully:", res.data.photo);

            setPhoto(res.data.photo);
            updateUser({ photo: res.data.photo });

        } catch (error) {
            console.error("No photo found", error);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const image = (e.currentTarget.elements[0] as HTMLInputElement).files?.[0];
        if (image) {
            // upload file
            const formData = new FormData();
            formData.append("staffNo", user?.staffNo || "");
            formData.append("photo", image);

            try {
                // send image to backend
                const res = await axios.put("/api/auth", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                addToast({
                    title: "Success",
                    description: res.data.message,
                    color: "success",
                });

            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }

        // get photo from backend
        await getPhoto();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPhoto(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>


            <div className="flex flex-col lg:flex-row">
                <div className="flex-1">


                    <p>{user ? user?.firstName + " " + user?.lastName : ""}</p>

                    {(!user?.photo || user?.photo === "null") ? (
                        <p className="text-red-500">No profile photo available</p>
                    ) : (
                        <img id="photoPreview" src={photo ? photo : user?.photo} alt="Profile Photo" className="mt-4 max-w-xs rounded-lg" />
                    )}

                    <form onSubmit={handleSubmit} className="mt-4">
                        <input type="file"
                            accept="image/*"
                            name="profilePhoto"
                            onChange={(e) => { handleFileChange(e); }}
                            className="block text-sm text-slate-500
         file:mr-4 file:py-2 file:px-4 file:rounded-lg
         file:border-0 file:text-sm file:font-semibold
         file:bg-primary-300 file:text-primary-700
         hover:file:bg-primary-100 file:transition-colors file:duration-2000 file:ease-in-out"
                        />
                        <Button color="secondary" variant="flat" type="submit" className="mt-2">
                            Upload
                        </Button>
                    </form>
                </div>
                <div className="flex-1">
                    <Input type="email" label="Email" value={user?.email || ""} disabled className="mt-4" />
                    <Input type="text" label="Staff No" value={user?.staffNo || ""} disabled className="mt-4" />
                    <Input type="text" label="Branch No" value={user?.branchNo || ""} disabled className="mt-4" />
                    <Input type="text" label="Telephone" value={user?.telephone || ""} disabled className="mt-4" />
                    <Input type="text" label="Mobile" value={user?.mobile || ""} disabled className="mt-4" />
                    <Input type="text" label="Position" value={user?.position || ""} disabled className="mt-4" />
                    <NumberInput hideStepper type="number" label="Salary" value={user?.salary} disabled className="mt-4" />
                </div>
            </div>
        </div>
    );
}