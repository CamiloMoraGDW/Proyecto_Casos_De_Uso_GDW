import React, { useState } from 'react';
import { auth, firestore } from '../../credenciales_firebase';  // Asegúrate de importar tus credenciales de Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import LogoNegro from "../assets/LogoGdwBlanco.png"
import { FaEyeSlash } from 'react-icons/fa';

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [cargo, setCargo] = useState(''); // cargo del usuario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            // Registro del usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const roleInApp = email.endsWith('@godoworks.com') || email.endsWith('@godoworks.com.co') ? 'admin' : 'lector';

            // Crear documento del usuario en Firestore
            await setDoc(doc(firestore, 'users', user.uid), {
                firstName: firstName,
                lastName: lastName,
                role: role, // Cargo personalizado
                email: user.email,
                userRole: roleInApp, // Rol en la aplicación
                createdAt: new Date()
            });

            setSuccess(true);
        } catch (error) {
            setError('Error al registrarse: ' + error.message);
        }
    };

    return (
        <div className="flex min-h-screen animate-blurred-fade-in duration-100">
            {/* Columna Izquierda */}
            <div className="w-1/2 max-[700px]:hidden flex-col items-center justify-center bg-gdwNegro p-12 lg:flex lg:items-center">
                <div className="mb-8 w-full flex justify-center">
                    <img
                        src={LogoNegro}
                        alt="Logo de la empresa"
                        width={200}
                        height={75}
                    />
                </div>
                <h1 className="w-full mb-4 text-3xl font-bold text-white text-center">
                    Bienvenid@ al Portal de Información Técnica y de Uso Cliente
                </h1>
                <p className="text-base text-white text-center">
                    Esta es una solución destinada a consolidar información acerca del trabajo de cada cliente utilizando la aplicación de Godoworks...
                </p>
            </div>

            {/* Columna Derecha */}
            <div className="flex w-full items-center justify-center lg:w-1/2">
                <div className="w-full max-w-md p-8">
                    <div className="text-start">
                        <h2 className="text-[28px] font-bold text-gray-900">Regístrate en la Plataforma</h2>
                    </div>
                    <div className="w-full flex justify-start py-3">
                        <div className="h-1 w-1/3 bg-black rounded-full"></div>
                    </div>
                    <form onSubmit={handleRegister}>
                        <div className="">
                            <label htmlFor="nombre" className='pl-1'>Nombre:</label>
                            <div className='h-10 w-full p-1 flex justify-between items-center border-2 rounded-lg border-gray-400'>
                                <input
                                    className='outline-none h-full w-full'
                                    id="nombre"
                                    name='nombre'
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                                <div className="hover:cursor-pointer w-1/5">
                                    <div className=" h-full flex justify-center items-center">
                                        <FaEyeSlash className="text-3xl text-zinc-700 animate-zoom-in animate-duration-250" />
                                    </div>
                                </div>
                            </div>
                            <label htmlFor="nombre" className='pl-1'>Apellido:</label>
                            <div className='h-10 w-full p-1 flex justify-between items-center border-2 rounded-lg border-gray-400'>
                                <input
                                    className='outline-none h-full w-full'
                                    id="apellido"
                                    name='apellido'
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                                <div className="hover:cursor-pointer w-1/5">
                                    <div className=" h-full flex justify-center items-center">
                                        <FaEyeSlash className="text-3xl text-zinc-700 animate-zoom-in animate-duration-250" />
                                    </div>
                                </div>
                            </div>
                            <div className='h-10 w-full p-1 flex justify-between items-center border-2 rounded-lg border-gray-400'>
                                <input
                                    className='outline-none h-full w-full'
                                    id="apellido"
                                    name='apellido'
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                                <div className="hover:cursor-pointer w-1/5">
                                    <div className=" h-full flex justify-center items-center">
                                        <FaEyeSlash className="text-3xl text-zinc-700 animate-zoom-in animate-duration-250" />
                                    </div>
                                </div>
                            </div>





                            <div>
                                <label>Cargo:</label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Contraseña:</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Confirmar Contraseña:</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            {success && <p className="text-green-500">Registro exitoso. Usuario creado como {email.endsWith('@godoworks.com') || email.endsWith('@godoworks.com.co') ? 'admin' : 'lector'}.</p>}
                            <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Registrarse</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
