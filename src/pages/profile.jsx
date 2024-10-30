import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth, firestore, storage } from "../../credenciales_firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { FaRegCircleUser } from "react-icons/fa6";

function Profile() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState({ firstName: '', lastName: '', role: '', profilePicture: '' });
    const [editing, setEditing] = useState(false);
    const [newProfilePicture, setNewProfilePicture] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                // Cargar los datos del usuario desde Firestore
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

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setNewProfilePicture(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        try {
            const userRef = doc(firestore, "CDUusers", user.uid);

            // Si el usuario seleccionó una nueva foto de perfil, la subimos a Firebase Storage
            if (newProfilePicture) {
                const storageRef = ref(storage, `profilePictures/${user.uid}`);
                await uploadBytes(storageRef, newProfilePicture);
                const profilePictureURL = await getDownloadURL(storageRef);
                userData.profilePicture = profilePictureURL;
                await updateProfile(user, { photoURL: profilePictureURL });
            }

            // Actualizar el documento del usuario en Firestore
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
        }
    };

    return (
        <div className="animate-blurred-fade-in duration-100 p-8 flex justify-center items-center h-screen bg-slate-300">
            <div className="w-1/2 rounded-md p-3 bg-white">
                <div className="w-full flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Perfil de Usuario</h1>
                    {userData.profilePicture ? (
                        <img src={userData.profilePicture} alt="Perfil" className="profile-picture size-28 rounded-full border-2 border-gdwNegro" />
                    ) : (
                        <FaRegCircleUser className="w-8 h-8" />
                    )}
                </div>
                <div className="w-full flex justify-center items-center">
                    <div className="w-full h-1 my-3 rounded-full bg-gdwNegro"></div>
                </div>
                {user ? (
                    <div>
                        <div className="mb-4">
                            <label>Nombre:</label>
                            {editing ? (
                                <input
                                    type="text"
                                    name="firstName"
                                    value={userData.firstName}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                />
                            ) : (
                                <p>{userData.firstName}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label>Apellido:</label>
                            {editing ? (
                                <input
                                    type="text"
                                    name="lastName"
                                    value={userData.lastName}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                />
                            ) : (
                                <p>{userData.lastName}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label>Cargo:</label>
                            {editing ? (
                                <input
                                    type="text"
                                    name="cargo"
                                    value={userData.cargo}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                />
                            ) : (
                                <p>{userData.role}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label>Rol:</label>
                            <p>{userData.role}</p>
                        </div>

                        {editing && (
                            <div className="mb-4">
                                <label>Nueva Foto de Perfil:</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                        )}

                        <div className="flex space-x-4">
                            {editing ? (
                                <>
                                    <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 rounded">
                                        Guardar Cambios
                                    </button>
                                    <button onClick={handleEditToggle} className="bg-gray-500 text-white py-2 px-4 rounded">
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <div className="w-full flex justify-between">

                                    <button onClick={handleEditToggle} className="bg-blue-500 text-white py-2 px-4 rounded">
                                        Editar Perfil
                                    </button>
                                    <button onClick={() => signOut(auth)} className="bg-red-500 text-white py-2 px-4 rounded">
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                ) : (
                    <p>Cargando perfil...</p>
                )}
            </div>
        </div>
    );
}

export default Profile;
