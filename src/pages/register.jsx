import React, { useState } from 'react';
import { auth, firestore } from '../../credenciales_firebase';  // Asegúrate de importar tus credenciales de Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import LogoNegro from "../assets/LogoGdwBlanco.png"

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Registro del usuario
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            let role = 'lector';

            // Crear documento del usuario en Firestore
            await setDoc(doc(firestore, 'users', user.uid), {
                email: user.email,
                role: role,
                createdAt: new Date()
            });

            setSuccess(true);
        } catch (error) {
            setError('Error al registrarse: ' + error.message);
        }
    };

    return (
        <div className="flex min-h-screen animate-blurred-fade-in duration-100">
            {/* Columna Derecha */}
            <div className="w-1/2 max-[700px]:hidden flex-col items-center justify-center bg-gdwNegro p-12 lg:flex lg:items-center">
                <div className="mb-8 w-full flex justify-center" >
                    <img
                        src={LogoNegro}
                        alt="Logo de la empresa"
                        width={200}
                        height={75}
                    />
                </div>
                <h1 className="w-full mb-4 text-3xl font-bold text-white text-center">Bienvenid@ al Portal de Informacion Tecnica y de Uso Cliente</h1>
                <p className="text-base text-white text-center">
                    Esta es una solucion destinada a consolidar informacion a cerca del trabajo de cada cliente utilizando la aplicacion de Godoworks. Esta herramienta ayuda a comprender el flujo de trabajo, integraciones, configuraciones y tareas de cada cliente para aumentar la productividad, a su vez se facilita el acceso grandes cantidades de datos, que no tenian un acceso descetralizado.
                </p>
            </div>
            {/* Columna derecha */}
            <div className="flex w-full items-center justify-center lg:w-1/2">
                <div className="w-full max-w-md p-8">
                    <div className="text-start">
                        <h2 className="text-[28px] font-bold text-gray-900">Registrate en la Plataforma</h2>
                    </div>
                    <div className="w-full flex justify-start py-3">
                        <div className=" h-1 w-1/3 bg-black rounded-full"></div>
                    </div>
                    <form onSubmit={handleRegister}>
                        <div>
                            <label className='pl-1' htmlFor="email">Correo Electronico</label>
                            <div className="h-10 w-full p-1 flex justify-between items-center border-2 rounded-lg border-gray-400">
                                input
                            </div>
                        </div>
                        {/* <div>
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
                        {error && <p>{error}</p>}
                        {success && <p>Registro exitoso. Usuario creado como {email.endsWith('@godoworks.com') || email.endsWith('@godoworks.com.co') ? 'admin' : 'lector'}.</p>}
                        <button type="submit">Registrarse</button> */}
                    </form>
                </div>
            </div>

            <h2>Registro</h2>

        </div>
    );
}

export default Register;
