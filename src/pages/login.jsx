//Utils
import React, { useState } from "react"
import LogoNegro from "../assets/LogoGdwBlanco.png"
import {
    getAuth,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
//Assets
import { FaEye, FaEyeSlash } from "react-icons/fa";
import firebaseApp from "../../credenciales_firebase";
//Declaracion de Autenticacion y Firestore (Base de Datos)
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export default function Login() {
    //Estados
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [shown, setShown] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };


    const onChange = ({ currentTarget }) => setPassword(currentTarget.value);
    const showPass = () => setShown(!shown);

    async function submitHandler(e) {
        e.preventDefault();
        setError("");

        try {
            const usuario = await signInWithEmailAndPassword(auth, email, password);
            console.log(usuario);

            // Verificar si el usuario ya tiene un documento en Firestore
            const userDoc = doc(firestore, "CDUusers", usuario.user.uid);
            const userDocSnap = await getDoc(userDoc);

            // Si el documento no existe, crearlo
            if (!userDocSnap.exists()) {
                await setDoc(userDoc, {
                    email: usuario.user.email,
                    role: "lector",
                });
                console.log("Documento de usuario creado en Firestore");
            } else {
                console.log("El documento de usuario ya existe en Firestore");
            }

        } catch (error) {
            // Manejo de errores y mostrar mensajes de alerta
            switch (error.code) {
                case "auth/user-disabled":
                    setError("La cuenta ha sido deshabilitada.");
                    break;
                case "auth/user-not-found":
                    setError("No se encontró ninguna cuenta con este correo electrónico.");
                    break;
                case "auth/wrong-password":
                    setError("La contraseña es incorrecta.");
                    break;
                default:
                    setError(
                        "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
                    );
                    break;
            }
        }
    }

    const navigate = useNavigate();

    return (
        <>
            <div className="flex min-h-screen animate-blurred-fade-in duration-100">
                {/* Columna izquierda */}
                <div className="hidden w-1/2 flex-col items-center justify-center bg-gdwNegro p-12 lg:flex lg:items-center">
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
                            <h2 className="text-[28px] font-bold text-gray-900">Inicia sesión con tu cuenta</h2>
                        </div>
                        <div className="w-full flex justify-center py-3">
                            <div className=" h-1 w-1/3 bg-black rounded-full"></div>
                        </div>
                        <form className="" onSubmit={submitHandler}>
                            <div className="">
                                <label className="pl-1" htmlFor="email">Correo electrónico</label>
                                <div className="h-10 w-full p-1 flex justify-between items-center border-2 rounded-lg border-gray-400">
                                    <input
                                        className="outline-none h-full w-full"
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={handleChange}
                                        required />
                                </div>
                                <label className="pl-1" htmlFor="password">Contraseña</label>
                                <div className="h-10 w-full p-1 flex items-center pl-2 border-2 rounded-lg border-gray-400">
                                    <input
                                        className="outline-none w-4/5"
                                        id="password"
                                        name="password"
                                        type={shown ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={handleChange}
                                        required />
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
                                {error && <div className="text-rose-700">{error}</div>}
                                <div className="w-full flex justify-center mt-5">
                                    <button notype="submit" className="bg-black text-white rounded-lg py-2 px-3 duration-300 hover:px-5 hover:duration-300" onClick={() => navigate("/")}>
                                        Iniciar sesión
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
};