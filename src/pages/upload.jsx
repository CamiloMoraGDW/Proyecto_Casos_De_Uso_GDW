import React, { useState } from 'react';
import { firestore, storage } from '../../credenciales_firebase'; // Asegúrate de que Firebase esté inicializado aquí
import { collection, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
// Components
import DynamicInputGroup from '../components/inputWadding';
import Select from '../components/select';
import CustomFileInput from '../components/selectFile';

function Upload() {
    const [nombre, setNombre] = useState('')
    const [cliente, setCliente] = useState('')
    const [pais, setPais] = useState('')
    const [vertical, setVertical] = useState('')
    const [cuentas, setCuentas] = useState('')
    const [grupos, setGrupos] = useState('')
    const [tareas, seTareas] = useState([''])
    const [flujoTrabajo, setFlujoTrabajo] = useState('')
    const [condicion, setCondicion] = useState(false)
    const [configuraciones, setConfiguraciones] = useState([''])
    const [desarrollos, setDesarrollos] = useState([''])
    const [integracion, setIntegracion] = useState('')
    const [archivoImg, setArchivoImg] = useState(null)
    const [archivoPdf, setArchivoPdf] = useState(null)
    const [pdfText, setPdfText] = useState('')
    const [loading, setLoading] = useState(false)

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        switch (id) {
            case "nombre":
                setNombre(value);
                break;
            case "cliente":
                setCliente(value);
                break;
            case "pais":
                setPais(value);
                break;
            case "vertical":
                setVertical(value);
                break;
            case "cuentas":
                setCuentas(value);
                break;
            case "grupos":
                setGrupos(value);
                break;


        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center pt-20 md:pt-28 lg:pt-20 lg:pb-20 px-4 md:px-8">
            <div className="bg-white shadow-2xl rounded-lg w-full max-w-4xl">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Nuevo Documento</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                                Nombre de Documento
                            </label>
                            <input
                                id="nombre"
                                type="text"
                                placeholder="Informacion Tecnica Cliente xxxxx"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gdwNegro focus:border-gdwNegro sm:text-sm"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">
                                Cliente
                            </label>
                            <input
                                id="cliente"
                                type="text"
                                placeholder="Cliente xxxx"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gdwNegro focus:border-gdwNegro sm:text-sm"
                                value={formData.cliente}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="pais" className="block text-sm font-medium text-gray-700">
                                Pais
                            </label>
                            <input
                                id="pais"
                                type="text"
                                placeholder="Cliente xxxx"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gdwNegro focus:border-gdwNegro sm:text-sm"
                                value={formData.pais}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <Select
                            id='verticales'
                            label='Vertical'
                            value={formData.vertical}
                            onChange={handleSelectChange}
                            placeholder='Seleccione una vertical'
                            options={verticalOptions}
                        />
                        <div className="space-y-2">
                            <label htmlFor="cuentas" className="block text-sm font-medium text-gray-700">
                                Cuentas
                            </label>
                            <input
                                id="cuentas"
                                type="text"
                                placeholder="xx, xx, xx"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gdwNegro focus:border-gdwNegro sm:text-sm"
                                value={formData.cuentas}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="grupos" className="block text-sm font-medium text-gray-700">
                                Grupos
                            </label>
                            <input
                                id="grupos"
                                type="text"
                                placeholder="Grupo xx, grupo xx, grupo  xx"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gdwNegro focus:border-gdwNegro sm:text-sm"
                                value={formData.grupos}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <DynamicInputGroup
                            label='Tareas Generales'
                            type="text"
                            placeholder="Ingrese una tarea"
                            values={formData.tareas}
                            onChange={(newValues) => {
                                setFormData((prevData) => ({
                                    ...prevData,
                                    tareas: newValues,
                                }));
                            }}
                        />
                        <DynamicInputGroup
                            label='Flujos de Trabajo'
                            type="text"
                            placeholder="Ingrese un flujo de trabajo"
                            values={formData.flujoTrabajo}
                            onChange={(newValues) => {
                                setFormData((prevData) => ({
                                    ...prevData,
                                    flujoTrabajo: newValues,
                                }));
                            }}
                        />
                        <div className="space-y-2">
                            <label htmlFor="condicion" className="block text-sm font-medium text-gray-700">
                                ¿Condición?
                            </label>
                            <select
                                id="condicion"
                                value={formData.condicion}
                                onChange={handleCondicionChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gdwNegro focus:border-gdwNegro sm:text-sm"
                            >
                                <option value="" disabled>
                                    Seleccione una opción
                                </option>
                                {condicionOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <DynamicInputGroup
                            label='Configuraciones'
                            type="text"
                            placeholder="Ingrese una configuración"
                            values={formData.configuraciones}
                            onChange={(newValues) => {
                                setFormData((prevData) => ({
                                    ...prevData,
                                    configuraciones: newValues,
                                }));
                            }}
                        />
                        <div className="space-y-2">
                            <label htmlFor="integracion" className="block text-sm font-medium text-gray-700">
                                Integración
                            </label>
                            <input
                                id="integracion"
                                type="text"
                                placeholder="Integración con..."
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gdwNegro focus:border-gdwNegro sm:text-sm"
                                value={formData.integracion}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="w-full flex justify-center">
                            <CustomFileInput
                                label="Archivos (Ficha Técnica)"
                                onChange={(e) => handleFileChange(e, 'archivos1')}
                            />
                            <CustomFileInput
                                label="Archivos (Fichas Técnicas)"
                                onChange={(e) => handleFileChange(e, 'archivos2')}
                            />
                        </div>
                    </div>
                    <div className="w-full flex justify-center">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gdwNegro hover:bg-gdwNegro focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gdwNegro"
                        >
                            Subir Documento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Upload;
