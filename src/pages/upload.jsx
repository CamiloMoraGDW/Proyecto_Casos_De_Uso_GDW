import React, { useState } from 'react';

function Upload() {

    const [activeTab, setActiveTab] = useState("seccion1")

    const handleSubmit = (e) => {
        e.preventDefault()
        // Aquí iría la lógica para manejar el envío del formulario
        console.log("Formulario enviado")
    }

    const TabButton = ({ value, children }) => (
        <button
            className={`py-2 px-4 text-sm font-medium rounded-t-lg ${activeTab === value
                ? "bg-white text-gdwNegro border-b-2 border-gdwNegro"
                : "bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                }`}
            onClick={() => setActiveTab(value)}
        >
            {children}
        </button>
    )

    const InputGroup = ({ id, label, type = "text", placeholder }) => (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gdwNegro focus:border-gdwNegro sm:text-sm"
            />
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-md rounded-lg w-full max-w-4xl">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Formulario de Registro</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex" aria-label="Tabs">
                                <TabButton value="seccion1">Sección 1</TabButton>
                                <TabButton value="seccion2">Sección 2</TabButton>
                                <TabButton value="seccion3">Sección 3</TabButton>
                            </nav>
                        </div>
                    </div>

                    {activeTab === "seccion1" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in animate-duration-250">
                            <InputGroup id="nombre" label="Nombre del CDU" placeholder="Caso de Exito Cliente XXXX" required />
                            <InputGroup id="apellido" label="Apellido" placeholder="Tu apellido" />
                            <InputGroup id="email" label="Email" type="email" placeholder="tu@email.com" />
                            <InputGroup id="telefono" label="Teléfono" type="tel" placeholder="123-456-7890" />
                        </div>
                    )}

                    {activeTab === "seccion2" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in animate-duration-250">
                            <InputGroup id="direccion" label="Dirección" placeholder="Tu dirección" />
                            <InputGroup id="ciudad" label="Ciudad" placeholder="Tu ciudad" />
                            <InputGroup id="codigoPostal" label="Código Postal" placeholder="12345" />
                            <InputGroup id="pais" label="País" placeholder="Tu país" />
                        </div>
                    )}

                    {activeTab === "seccion3" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in animate-duration-250">
                            <InputGroup id="password" label="Contraseña" type="password" placeholder="********" />
                            <InputGroup id="confirmPassword" label="Confirmar Contraseña" type="password" placeholder="********" />
                            <InputGroup id="edad" label="Edad" type="number" placeholder="25" />
                            <InputGroup id="fechaNacimiento" label="Fecha de Nacimiento" type="date" />
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Enviar Formulario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Upload