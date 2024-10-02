import React, { useState } from 'react';

function Upload() {

    const [activeTab, setActiveTab] = useState("seccion1")
    const [inputs, setInputs] = useState([''])

    const agregarInput = () => {
        if (inputs.length < 10) {
            setInputs([...inputs, ''])
        }
    }

    const eliminarInput = (index) => {
        if (index === 0) return // Previene la eliminación del primer input
        const nuevosInputs = inputs.filter((_, i) => i !== index)
        setInputs(nuevosInputs)
    }

    const actualizarInput = (index, valor) => {
        const nuevosInputs = [...inputs]
        nuevosInputs[index] = valor
        setInputs(nuevosInputs)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        // Aquí iría la lógica para manejar el envío del formulario
        console.log("Formulario enviado")
    }

    const TabButton = ({ value, children }) => (
        <button
            className={`py-2 px-4 text-sm font-medium rounded-t-lg ${activeTab === value
                ? "bg-white text-gdwNegro border-b-2 border-gdwNegro animate-blurred-fade-in animate-duration-200"
                : "bg-gray-100 text-gray-600 duration-200 hover:text-gray-800 hover:bg-gray-200 hover:duration-200"
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
            <div className="bg-white shadow-2xl rounded-lg w-full max-w-4xl">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Nuevo Documento</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex" aria-label="Tabs">
                                <TabButton value="seccion1">Sección 1</TabButton>
                                <TabButton value="seccion2">Sección 2</TabButton>
                            </nav>
                        </div>
                    </div>

                    {activeTab === "seccion1" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in animate-duration-250">
                            <InputGroup id="nombre" label="Nombre de Documento" type='text' placeholder="Informacion Tecnica Cliente xxxxx" required />
                            <InputGroup id="cliente" label="Cliente" type='text' placeholder="Cliente xxxx" />
                            <InputGroup id="pais" label="Pais" type="text" placeholder="Uruguay, Combia, Argentina ...." />
                            <div className="space-y-2">
                                <label htmlFor='vertical' className="block text-sm font-medium text-gray-700">
                                    Vertical
                                </label>
                                <select className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gdwNegro focus:border-gdwNegro sm:text-sm' name="vertical" id="vertical">
                                    <option value="Service">Service</option>
                                    <option value="Trade">Trade</option>
                                </select>
                            </div>
                            <InputGroup id="cuentas" label="Cuentas" placeholder="xxxx, xxxx, xxxx" />
                            <InputGroup id="grupos" label="Grupos" placeholder="Grupo A, Grupo B, Grupo e" />
                        </div>
                    )}

                    {activeTab === "seccion2" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in animate-duration-250">
                            {inputs.map((input, index) => (
                                <div key={index} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gdwNegro focus:border-gdwNegro sm:text-sm">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => actualizarInput(index, e.target.value)}
                                        placeholder={index === 0 ? "Input fijo" : `Texto ${index + 1}`}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {index !== 0 && (
                                        <button
                                            type="button"
                                            onClick={() => eliminarInput(index)}
                                            aria-label={`Eliminar input ${index + 1}`}
                                            className="p-2 text-red-500 hover:bg-red-100 rounded-md transition-colors duration-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    onClick={agregarInput}
                                    disabled={inputs.length >= 10}
                                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${inputs.length >= 10
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                        }`}
                                >
                                    Agregar otro input
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                                >
                                    Enviar
                                </button>
                            </div>
                            {inputs.length >= 10 && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Has alcanzado el límite máximo de 10 inputs.
                                </p>
                            )}
                            <InputGroup id="pais" label="País" placeholder="Tu país" />
                            <InputGroup id="password" label="Contraseña" type="password" placeholder="********" />
                            <InputGroup id="confirmPassword" label="Confirmar Contraseña" type="password" placeholder="********" />
                            <InputGroup id="edad" label="Edad" type="number" placeholder="25" />
                            <InputGroup id="fechaNacimiento" label="Fecha de Nacimiento" type="date" />
                        </div>
                    )}

                    <div className="mt-6 flex justify-center">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gdwNegro hover:px-6    "
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