import React, { useState } from 'react';
import { db, storage } from '../../credenciales_firebase'; // Ensure Firebase is initialized here
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
// Components
import DynamicInputGroup from '../components/inputWadding';
import Select from '../components/select';
import CustomFileInput from '../components/selectFile';

function Upload() {
    const [formData, setFormData] = useState({
        nombre: '',
        cliente: '',
        pais: '',
        vertical: '',
        cuentas: '',
        grupos: '',
        tareas: [''],
        flujoTrabajo: [''],
        condicion: '',
        configuraciones: [''],
        integracion: '',
        archivos1: [],
        archivos2: [],
    });
    const [selectedFiles1, setSelectedFiles1] = useState([]); // For first file input
    const [selectedFiles2, setSelectedFiles2] = useState([]); // For second file input

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value // Actualiza solo el campo modificado
        }));
    };

    const handleSelectChange = (event) => {
        const { value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            vertical: value
        }));
    };

    const handleCondicionChange = (event) => {
        const { value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            condicion: value,
            configuraciones: value === 'si' && prevData.configuraciones.length === 0 ? [''] : prevData.configuraciones
        }));
    };

    const handleFileChange = (event, inputId) => {
        const fileArray = Array.from(event.target.files);
        setFormData((prevData) => ({
            ...prevData,
            [inputId]: fileArray.map((file) => file.name)
        }));
        if (inputId === 'archivos1') {
            setSelectedFiles1(fileArray);
        } else {
            setSelectedFiles2(fileArray);
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Save form data to Firestore
            await setDoc(doc(db, 'documents', formData.nombre), formData);

            // Upload files from the first file input
            selectedFiles1.forEach(async (file) => {
                const uniqueName = `${Date.now()}_${file.name}`;
                const storageRef = ref(storage, `uploads/${uniqueName}`);
                await uploadBytes(storageRef, file);
            });

            // Upload files from the second file input
            selectedFiles2.forEach(async (file) => {
                const uniqueName = `${Date.now()}_${file.name}`;
                const storageRef = ref(storage, `uploads/${uniqueName}`);
                await uploadBytes(storageRef, file);
            });

            console.log("Formulario enviado y archivos subidos");
        } catch (error) {
            console.error("Error al enviar el formulario: ", error);
        }
    };

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
                value={formData[id] || ''}
                onChange={handleInputChange}
                required
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center pt-20 md:pt-28 lg:pt-20 lg:pb-20 px-4 md:px-8">
            <div className="bg-white shadow-2xl rounded-lg w-full max-w-4xl">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Nuevo Documento</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup id="nombre" label="Nombre de Documento" placeholder="Informacion Tecnica Cliente xxxxx" />
                        <InputGroup id="cliente" label="Cliente" placeholder="Cliente xxxx" />
                        <InputGroup id="pais" label="Pais" placeholder="Uruguay, Combia, Argentina ...." />
                        <Select
                            id='verticales'
                            label='Vertical'
                            value={formData.vertical}
                            onChange={handleSelectChange}
                            placeholder='Seleccione una vertical'
                            options={verticalOptions}
                        />
                        <InputGroup id="cuentas" label="Cuentas" placeholder="xxxx, xxxx, xxxx" />
                        <InputGroup id="grupos" label="Grupos" placeholder="Grupo A, Grupo B, Grupo e" />
                    </div>

                    <DynamicInputGroup
                        label='Tareas Generales'
                        type="text"
                        placeholder="Ingrese una tarea"
                        values={formData.tareas}
                        onChange={(updatedValues) => setFormData(prevData => ({ ...prevData, tareas: updatedValues }))}
                    />
                    <DynamicInputGroup
                        label='Flujo de Trabajo (Puntos Generales)'
                        type="text"
                        placeholder="Ingrese un punto"
                        values={formData.flujoTrabajo}
                        onChange={(updatedValues) => setFormData(prevData => ({ ...prevData, flujoTrabajo: updatedValues }))}
                    />
                    <Select
                        id='condicion'
                        label='Cuenta con desarrollo?'
                        value={formData.condicion}
                        onChange={handleCondicionChange}
                        placeholder='Seleccione una opción'
                        options={condicionOptions}
                    />
                    <DynamicInputGroup
                        label={formData.condicion === 'si' ? 'Configuraciones de desarrollo' : 'Configuraciones Especiales'}
                        type='text'
                        placeholder={formData.condicion === 'si' ? 'Conf. de Desarrollo' : 'Conf. Especiales'}
                        values={formData.configuraciones}
                        onChange={(updatedValues) => setFormData(prevData => ({ ...prevData, configuraciones: updatedValues }))}
                    />
                    <InputGroup id="integracion" label="Integracion" type="text" placeholder="SAP, ZOHO, etc" />
                    <div className='flex gap-4'>
                        <CustomFileInput onChange={(e) => handleFileChange(e, 'archivos1')} />
                        <CustomFileInput onChange={(e) => handleFileChange(e, 'archivos2')} />
                    </div>

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
