
import { FaRegCircleUser } from "react-icons/fa6";
import Logo from '../assets/LogoGdwNegro.png'
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { firestore, auth } from "../../credenciales_firebase";

function Header() {
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
                    <span onClick={() => navigate("/lista-cdus")} className="relative text-gray-600 hover:text-primary transition-colors duration-300 hover-underline-animation">
                        Productos
                    </span>
                    <span onClick={() => navigate("/agregar-cdu")} className="relative text-gray-600 hover:text-primary transition-colors duration-300 hover-underline-animation">
                        Servicios
                    </span>
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
}

export default Header