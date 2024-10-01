//Utils
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
//Assets
import { FaRegCircleUser } from "react-icons/fa6";
import { firestore, auth } from "../../credenciales_firebase";
import { TiDocumentText } from "react-icons/ti";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import Logo from '../assets/LogoGdwNegro.png'
//////////////////////////////////////////////////////////////////////
export default function Header() {
    const [profilePicURL, setProfilePicURL] = useState("");
    const [role, setRole] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(firestore, "CDUusers", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setProfilePicURL(data.profilePicture || "");
                    setRole(data.role); // Obtener y establecer el rol del usuario
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const navigate = useNavigate();

    return (
        <>
            <header className="flex items-center justify-around px-4 py-2 bg-white shadow-md">
                <span onClick={() => navigate("/")} className="flex items-center space-x-2 hover:cursor-pointer">
                    <img src={Logo} className="w-10 h-10 text-primary" />
                </span>

                <nav className="space-x-4">
                    <span
                        onClick={() => navigate("/lista-cdus")}
                        className="group relative inline-block text-sm font-medium transition-all hover:text-primary hover:cursor-pointer"
                    >
                        <span className="flex justify-center items-center text-gray-600 text-base p-1 gap-1">
                            Listado CDU
                            <TiDocumentText />
                        </span>
                        <span className="absolute bottom-0 left-0 h-[3px] w-full scale-x-0 bg-gray-600 rounded-full transition-all group-hover:scale-x-100" />
                    </span>

                    {role === "admin" && (
                        <span
                            onClick={() => navigate("/nuevo-cdu")}
                            className="group relative inline-block text-sm font-medium transition-all hover:text-primary hover:cursor-pointer"
                        >
                            <span className="flex justify-center items-center text-gray-600 text-base p-1 gap-1">
                                Agregar CDU
                                <HiOutlineDocumentAdd />
                            </span>
                            <span className="absolute bottom-0 left-0 h-[3px] w-full scale-x-0 bg-gray-600 rounded-full transition-all group-hover:scale-x-100" />
                        </span>
                    )}

                </nav>

                <div className="flex items-center space-x-4">

                    <span onClick={() => navigate("/profile")} className="hover:cursor-pointer">
                        {profilePicURL ? (
                            <img src={profilePicURL} alt="Perfil" className="profile-picture" />
                        ) : (
                            <FaRegCircleUser className="w-8 h-8" />
                        )}
                    </span>
                </div>
            </header>
        </>
    )
};