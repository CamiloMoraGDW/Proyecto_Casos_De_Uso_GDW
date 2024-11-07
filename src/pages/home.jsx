import React from "react"
import Logo from '../assets/LogoGdwNegro.png'
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaExchangeAlt } from "react-icons/fa";
import Header from "../components/header";




function Home() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-slate-200 to-white flex flex-col items-center justify-center p-4 animate-blurred-fade-in duration-100">
                <div className="max-w-4xl w-full space-y-8">
                    {/* Logo de la empresa */}
                    <div className="flex justify-center items-center gap-10">
                        <img
                            src={Logo}
                            alt="Logo de la empresa"
                            width={200}
                            height={100}
                            className="mb-8"
                        />
                        <FaExchangeAlt className="size-[100px]" />

                        <HiOutlineClipboardDocumentList className="size-[200px]" />

                    </div>

                    {/* Texto contextual */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-gray-800">Portal de Informacion Tecnica y de Uso Cliente</h1>
                        <p className="text-xl text-gray-600">
                            Esta es una solucion destinada a consolidar informacion a cerca del trabajo de cada cliente utilizando la aplicacion de Godoworks. Esta herramienta ayuda a comprender el flujo de trabajo, integraciones, configuraciones y tareas de cada cliente para aumentar la productividad, a su vez se facilita el acceso grandes cantidades de datos, que no tenian un acceso descetralizado.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Home