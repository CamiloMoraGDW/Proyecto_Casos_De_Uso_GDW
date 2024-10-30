import React, { useState } from 'react';
import { auth, firestore } from '../../credenciales_firebase';  // Asegúrate de importar tus credenciales de Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import LogoNegro from "../assets/LogoGdwBlanco.png"
import { FaEyeSlash } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa';
import { IoIosMail } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { MdBusinessCenter } from "react-icons/md";
import { useNavigate } from 'react-router-dom';




function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [cargo, setCargo] = useState('');
    const [role, setRole] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [shown, setShown] = useState(false)

    const showPass = () => setShown(!shown)

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setRole('lector');

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            // Registro del usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Crear documento del usuario en Firestore
            await setDoc(doc(firestore, 'CDUusers', user.uid), {
                firstName: firstName,
                lastName: lastName,
                cargo: cargo, // Cargo personalizado
                email: user.email,
                role: role, // Rol en la aplicación
                createdAt: new Date()
            });

            alert('Registro Exitoso');
            setSuccess(true);
        } catch (error) {
            setError('Error al registrarse: ' + error.message);
        }
    };

    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen">
            {/* Columna Izquierda */}
            <div className="w-2/3 max-[700px]:hidden flex-col items-center justify-center bg-gdwNegro p-12 lg:flex lg:items-center animate-slide-in-left">
                <div className="mb-8 w-full flex justify-start">
                    <img
                        src={LogoNegro}
                        alt="Logo de la empresa"
                        width={200}
                        height={75}
                    />
                </div>
                <h1 className="w-full mb-4 text-3xl font-bold text-white text-start">
                    Bienvenid@ al Portal de Información Técnica y de Uso Cliente
                </h1>
                <p className="text-base text-white text-start">
                    Esta es una solución destinada a consolidar información acerca del trabajo de cada cliente utilizando la aplicación de Godoworks...
                </p>
            </div>

            {/* Columna Derecha */}
            <div className="flex w-full items-center justify-center lg:w-1/2">
                <div className="w-3/4 p-8 animate-slide-in-right">
                    <div className="text-start">
                        <h2 className="text-[28px] font-bold text-gray-900">Regístrate en la Plataforma</h2>
                    </div>
                    <div className="w-full flex justify-start py-3">
                        <div className="h-1 w-1/3 bg-black rounded-full"></div>
                    </div>
                    <form className='' onSubmit={handleRegister}>
                        <div className="">
                            <label htmlFor="email" className='pl-1'>Email:</label>
                            <div className='h-10 w-full p-1 flex justify-between items-center border-2 rounded-lg border-gray-400'>
                                <input
                                    className='outline-none h-full w-full'
                                    id="email"
                                    name='email'
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <div className="w-1/5">
                                    <div className=" h-full flex justify-center items-center">
                                        <IoIosMail className="text-3xl text-zinc-700 animate-zoom-in animate-duration-250" />
                                    </div>
                                </div>
                            </div>
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
                                        <FaUser className="text-2xl text-zinc-700 animate-zoom-in animate-duration-250" />
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
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                                <div className="hover:cursor-pointer w-1/5">
                                    <div className=" h-full flex justify-center items-center">
                                        <FaUser className="text-2xl text-zinc-700 animate-zoom-in animate-duration-250" />
                                    </div>
                                </div>
                            </div>
                            <label htmlFor="cargo" className='pl-1'>Cargo:</label>
                            <div className='h-10 w-full p-1 flex justify-between items-center border-2 rounded-lg border-gray-400'>
                                <input
                                    className='outline-none h-full w-full'
                                    id="cargo"
                                    name='cargo'
                                    type="text"
                                    value={cargo}
                                    onChange={(e) => setCargo(e.target.value)}
                                    required
                                />
                                <div className="hover:cursor-pointer w-1/5">
                                    <div className=" h-full flex justify-center items-center">
                                        <MdBusinessCenter className="text-3xl text-zinc-700 animate-zoom-in animate-duration-250" />
                                    </div>
                                </div>
                            </div>
                            <label htmlFor="password" className='pl-1'>Contraseña:</label>
                            <div className='h-10 w-full p-1 flex justify-between items-center border-2 rounded-lg border-gray-400'>
                                <input
                                    className='outline-none h-full w-full'
                                    id="password"
                                    name='password'
                                    type={shown ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div onClick={showPass} className="hover:cursor-pointer w-1/5">
                                    {shown ?
                                        <>
                                            <div className=" h-full flex justify-center items-center">
                                                <FaEyeSlash className="text-3xl text-zinc-700 animate-zoom-in animate-duration-250" />
                                            </div>
                                        </>
                                        :
                                        <div className="h-full flex justify-center items-center">
                                            <FaEye className="text-3xl text-zinc-700 animate-zoom-in animate-duration-250" />

                                        </div>
                                    }
                                </div>
                            </div>
                            <label htmlFor="confirmPassword" className='pl-1'>Confirmar contraseña:</label>
                            <div className='h-10 w-full p-1 flex justify-between items-center border-2 rounded-lg border-gray-400'>
                                <input
                                    className='outline-none h-full w-full'
                                    id="confimPassword"
                                    name='confirmPassword'
                                    type={shown ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <div onClick={showPass} className="hover:cursor-pointer w-1/5">
                                    {shown ?
                                        <>
                                            <div className=" h-full flex justify-center items-center">
                                                <FaEyeSlash className="text-3xl text-zinc-700 animate-zoom-in animate-duration-250" />
                                            </div>
                                        </>
                                        :
                                        <div className="h-full flex justify-center items-center">
                                            <FaEye className="text-3xl text-zinc-700 animate-zoom-in animate-duration-250" />

                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="w-full flex justify-start items-center ml-1 mt-1">
                                <span>Ya tienes una cuenta? <span onClick={() => navigate("/login")} className='text-gdwAzul hover:cursor-pointer'>Iniciar Sesion.</span></span>
                            </div>
                            {error && <p className="text-red-500 ml-1">{error}</p>}
                            <button type="submit" className="mt-1 ml-1 bg-gdwNegro text-white py-2 px-4 rounded duration-200 hover:px-6 hover:duration-200">Registrarse</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
