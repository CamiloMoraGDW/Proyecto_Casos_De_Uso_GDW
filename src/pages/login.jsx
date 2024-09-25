import React, { useEffect, useState } from "react"
import LogoNegro from "../assets/LogoGdwBlanco.png"
import { FaEye, FaEyeSlash } from "react-icons/fa";

import firebaseApp from "../../credenciales_firebase";
import {
    getAuth,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
import AOS from "aos";
import "aos/dist/aos.css";

function Login() {
    useEffect(() => {
        AOS.init({
            duration: 500, // duración de la animación en milisegundos
            easing: "ease-in-out", // tipo de easing de la animación
            once: false, // si la animación debería ocurrir solo una vez
        });
    }, []);

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
                case "auth/invalid-email":
                    setError("El correo electrónico no es válido.");
                    break;
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
            <div className="flex min-h-screen">
                {/* Columna izquierda */}
                <div className="hidden w-1/2 flex-col justify-center bg-black p-12 lg:flex lg:items-center">
                    <div className="mb-8 w-full flex justify-start">
                        <img
                            src={LogoNegro}
                            alt="Logo de la empresa"
                            width={200}
                            height={75}
                        />
                    </div>
                    <h1 className="w-full mb-4 text-4xl font-bold text-white">Bienvenid@ al Protal de Casos de Uso</h1>
                    <p className="text-lg text-white">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam ducimus, maxime ab, blanditiis soluta saepe at sunt esse eius placeat, incidunt consequatur mollitia et quasi sed ea fugit optio nobis?
                    </p>
                </div>

                {/* Columna derecha */}
                <div className="flex w-full items-center justify-center lg:w-1/2">
                    <div className="w-full max-w-md space-y-8 p-8">
                        <div className="text-start mb-0">
                            <h2 className="text-[28px] font-bold text-gray-900">Inicia sesión en tu cuenta</h2>
                        </div>
                        <div className="w-full flex justify-center mx-0">
                            <div className="h-1 w-1/3 bg-black rounded-full"></div>
                        </div>
                        <form className="mt-4 space-y-6" onSubmit={submitHandler}>
                            <div className="space-y-4">
                                <div className="flex flex-col justify-center a">
                                    <label htmlFor="email">Correo electrónico</label>
                                    <input
                                        className="h-10 rounded-lg border-2 border-solid border-gray-400 p-1"
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={handleChange}
                                        required />
                                </div>
                                <div className="flex flex-col justify-center a">
                                    <label htmlFor="password">Contraseña</label>
                                    <input
                                        className="h-10 rounded-lg border-2 border-solid border-gray-400 p-1"
                                        id="password"
                                        name="password"
                                        type={shown ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={handleChange}
                                        required />
                                    <div onClick={showPass} className="hover:cursor-pointer mt-2">
                                        {shown ?
                                            <>
                                                <div className="flex justify-start items-center">
                                                    <FaEyeSlash className="pr-1 text-3xl" />
                                                    <h1>Ocultar Contrasena</h1>
                                                </div>
                                                <span className="absolute bottom-0 left-0 h-[3px] w-full scale-x-0 bg-primary transition-all group-hover:scale-x-100" />
                                            </>
                                            :
                                            <div className="flex justify-start items-center">
                                                <FaEye className="pr-1 text-3xl" />
                                                <h1>Mostrar Contrasena</h1>
                                            </div>
                                        }
                                    </div>
                                </div>
                                {error && <div className="error-message">{error}</div>}
                                <div className="w-full flex justify-center">
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
}

export default Login