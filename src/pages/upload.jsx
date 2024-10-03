import React, { useState } from 'react';
// Components
import DynamicInputGroup from '../components/inputWadding';
import Select from '../components/select';

function Upload() {
    const [activeTab, setActiveTab] = useState("seccion1");
    const [selectedValue, setSelectedValue] = useState("");
    const [selectedCondicion, setSelectedCondicion] = useState(""); // Estado para la opción de condición

    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleCondicionChange = (event) => {
        setSelectedCondicion(event.target.value);
    };

    const verticalOptions = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
    ];

    const condicionOptions = [
        { value: "si", label: "SI" },
        { value: "no", label: "NO" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Formulario enviado");
    };

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
    );

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
    );

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
                            <Select
                                id='verticales'
                                label='Vertical'
                                value={selectedValue}
                                onChange={handleSelectChange}
                                placeholder='Seleccione una vertical'
                                options={verticalOptions}
                            />
                            <InputGroup id="cuentas" label="Cuentas" placeholder="xxxx, xxxx, xxxx" />
                            <InputGroup id="grupos" label="Grupos" placeholder="Grupo A, Grupo B, Grupo e" />
                        </div>
                    )}

                    {activeTab === "seccion2" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in animate-duration-250">

                            <DynamicInputGroup
                                label='Tareas Generales'
                                type="text"
                                placeholder="Ingrese una tarea"
                                values={[""]}
                            />
                            <DynamicInputGroup
                                label='Flujo de Trabajo (Puntos Generales)'
                                type="text"
                                placeholder="Ingrese un punto"
                                values={[""]}
                            />
                            <Select
                                id='condicion'
                                label='Condición'
                                value={selectedCondicion}
                                onChange={handleCondicionChange}
                                placeholder='Seleccione una opción'
                                options={condicionOptions}
                            />
                            {selectedCondicion === 'si' ? <h1>Aprobado</h1> : <br></br>}

                            <InputGroup id="confirmPassword" label="Confirmar Contraseña" type="password" placeholder="********" />
                            <InputGroup id="edad" label="Edad" type="number" placeholder="25" />
                            <InputGroup id="fechaNacimiento" label="Fecha de Nacimiento" type="date" />

                        </div>
                    )}

                    <div className="mt-6 flex justify-center">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gdwNegro duration-200 hover:px-6 hover:duration-200"
                        >
                            Enviar Formulario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Upload;
