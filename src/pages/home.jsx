import React from "react"
import Logo from '../assets/LogoGdwNegro.png'


function Home() {
    return (
        <>
            <div className="min-h-screen bg-slate-200 to-white flex flex-col items-center justify-center p-4 animate-blurred-fade-in duration-100">
                <div className="max-w-4xl w-full space-y-8">
                    {/* Logo de la empresa */}
                    <div className="flex justify-center">
                        <img
                            src={Logo}
                            alt="Logo de la empresa"
                            width={200}
                            height={100}
                            className="mb-8"
                        />
                    </div>

                    {/* Texto contextual */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-gray-800">Portal Casos de Uso</h1>
                        <p className="text-xl text-gray-600">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veritatis esse deserunt dolorum commodi tenetur labore laborum, perferendis neque corrupti. Nam, ex id deleniti aperiam quasi laudantium veritatis. Veritatis, consequuntur quam.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Home