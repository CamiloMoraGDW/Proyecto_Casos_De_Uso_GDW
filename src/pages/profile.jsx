import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth, firestore, storage } from "../../credenciales_firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { FaRegCircleUser, FaBriefcase, FaUser, FaUserTag, FaPlus } from "react-icons/fa6";

function Profile() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState({ firstName: '', lastName: '', role: '', profilePicture: '' });
    const [editing, setEditing] = useState(false);
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const userDoc = await getDoc(doc(firestore, "CDUusers", user.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, []);

    const handleEditToggle = () => setEditing(!editing);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setNewProfilePicture(file);

            // Mostrar la imagen seleccionada inmediatamente como vista previa
            const previewURL = URL.createObjectURL(file);
            setUserData(prevState => ({
                ...prevState,
                profilePicture: previewURL,
            }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const userRef = doc(firestore, "CDUusers", user.uid);

            if (newProfilePicture) {
                const storageRef = ref(storage, `profilePictures/${user.uid}`);
                await uploadBytes(storageRef, newProfilePicture);
                const profilePictureURL = await getDownloadURL(storageRef);
                userData.profilePicture = profilePictureURL;
                await updateProfile(user, { photoURL: profilePictureURL });
            }

            await updateDoc(userRef, {
                firstName: userData.firstName,
                lastName: userData.lastName,
                cargo: userData.cargo,
                profilePicture: userData.profilePicture
            });

            setEditing(false);
            setNewProfilePicture(null);
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="flex justify-center items-start h-full bg-gray-100">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl text-center animate-fade-in my-10">
                    <div className="flex justify-between items-center">

                        <h1 className="text-3xl font-bold mb-6 text-gray-800">Perfil de Usuario</h1>
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            {userData.profilePicture ? (
                                <img src={userData.profilePicture} alt="Perfil" className="w-full h-full rounded-full border-4 border-black object-cover" />
                            ) : (
                                <FaRegCircleUser className="w-full h-full text-gray-500 rounded-full border-4 border-black" />
                            )}
                            {editing && (
                                <>
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-70">
                                        <FaPlus className="text-white text-2xl" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {user ? (
                        <div className="text-left space-y-4">
                            <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                <FaUser className="text-gray-600 text-2xl mr-4" />
                                <div className="flex flex-col w-2/3">
                                    <span className="text-gray-500 font-semibold">Nombre</span>
                                    {editing ? (
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={userData.firstName}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-2 rounded-xl w-full"
                                        />
                                    ) : (
                                        <span className="text-gray-800 font-medium text-lg">{userData.firstName}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                <FaUser className="text-gray-600 text-2xl mr-4" />
                                <div className="flex flex-col w-2/3">
                                    <span className="text-gray-500 font-semibold">Apellido</span>
                                    {editing ? (
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={userData.lastName}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-2 rounded-xl w-full"
                                        />
                                    ) : (
                                        <span className="text-gray-800 font-medium text-lg">{userData.lastName}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                <FaBriefcase className="text-gray-600 text-2xl mr-4" />
                                <div className="flex flex-col w-2/3">
                                    <span className="text-gray-500 font-semibold">Cargo</span>
                                    {editing ? (
                                        <input
                                            type="text"
                                            name="cargo"
                                            value={userData.cargo}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-2 rounded-xl w-full"
                                        />
                                    ) : (
                                        <span className="text-gray-800 font-medium text-lg">{userData.cargo}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                <FaUserTag className="text-gray-600 text-2xl mr-4" />
                                <div className="flex flex-col">
                                    <span className="text-gray-500 font-semibold">Rol</span>
                                    <span className="text-gray-800 font-medium text-lg">{userData.role}</span>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-4 mt-6">
                                {editing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="bg-gdwNegro text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition"
                                            disabled={loading}
                                        >
                                            {loading ? "Guardando cambios..." : "Guardar Cambios"}
                                        </button>
                                        <button onClick={handleEditToggle} className="bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition">
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={handleEditToggle} className="bg-gdwNegro text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition">
                                            Editar Perfil
                                        </button>
                                        <button onClick={() => signOut(auth)} className="bg-red-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition">
                                            Cerrar Sesión
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Cargando perfil...</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Profile;
