import React, { useRef, useState } from 'react';
import { firestore, storage } from '../../credenciales_firebase'; // Asegúrate de que Firebase esté inicializado correctamente
import { collection, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
// Components
import DynamicInputGroup from '../components/inputWadding'; // Cambia según tu componente real
import Select from '../components/select';
import pdfToText from 'react-pdftotext';

function Upload() {
    const verticalOptions = [
        { value: 'service', label: 'Service' },
        { value: 'trade', label: 'Trade' }, // Cambié el valor aquí para que sea único
    ];

    const condicionOptions = [
        { value: 'si', label: 'SI' },
        { value: 'no', label: 'NO' },
    ];

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
        desarrollos: [''],
        integracion: '',
        archivoPdf: null,
        pdfText: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const pdfInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSelectChange = (value, id) => {
        setFormData((prevData) => ({
            ...prevData,
            [id]: value, // Guardamos solo el valor seleccionado
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            archivoPdf: file,
        }));
        pdfToText(file)
            .then((text) => {
                console.log('Texto extraído con éxito:', text);
                setFormData((prevData) => ({
                    ...prevData,
                    pdfText: text,
                }));
            })
            .catch((error) => {
                console.error('Error al extraer el texto:', error);
                setError('Error al extraer el texto');
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { archivoPdf } = formData;

        if (!archivoPdf) {
            setError('Por favor, sube un archivo PDF');
            setLoading(false);
            return;
        }

        try {
            // Subida del archivo PDF a Firebase Storage
            const storageReferencePdf = storageRef(storage, `fichasTecnicas/${archivoPdf.name}`);
            await uploadBytes(storageReferencePdf, archivoPdf);
            const pdfUrl = await getDownloadURL(storageReferencePdf);

            // Preparar el objeto para Firestore
            const docData = {
                ...formData,
                pdfUrl, // Guardar la URL del archivo subido en Firestore
            };

            // Eliminar la propiedad archivoPdf antes de guardar en Firestore
            delete docData.archivoPdf;

            // Guardar los datos en Firestore
            const docRef = await addDoc(collection(firestore, 'DocsTecnicos'), docData);
            alert('Documento añadido con éxito');

            // Resetear el formulario
            setFormData({
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
                desarrollos: [''],
                integracion: '',
                archivoPdf: null,
                pdfText: '',
            });

            if (pdfInputRef.current) {
                pdfInputRef.current.value = null;
            }

            console.log('Documento añadido con ID:', docRef.id);
        } catch (error) {
            console.error('Error subiendo el PDF a Firebase Storage o guardando en Firestore:', error);
            setError('Hubo un error subiendo el archivo o guardando los datos.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex justify-center pt-20 md:pt-28 lg:pt-20 lg:pb-20 px-4 md:px-8">
            <div className="bg-white shadow-2xl rounded-lg w-full max-w-4xl">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Nuevo Documento</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                                Nombre de Documento
                            </label>
                            <input
                                id="nombre"
                                type="text"
                                placeholder="Información Técnica Cliente xxxxx"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Cliente */}
                        <div className="space-y-2">
                            <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">
                                Cliente
                            </label>
                            <input
                                id="cliente"
                                type="text"
                                placeholder="Cliente xxxx"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                                value={formData.cliente}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* País */}
                        <div className="space-y-2">
                            <label htmlFor="pais" className="block text-sm font-medium text-gray-700">
                                País
                            </label>
                            <input
                                id="pais"
                                type="text"
                                placeholder="País"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                                value={formData.pais}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Vertical */}
                        <Select
                            id="vertical"
                            label="Vertical"
                            value={formData.vertical}
                            onChange={(value) => handleSelectChange(value, 'vertical')}
                            placeholder="Seleccione una vertical"
                            options={verticalOptions}
                        />

                        {/* Cuentas */}
                        <div className="space-y-2">
                            <label htmlFor="cuentas" className="block text-sm font-medium text-gray-700">
                                Cuentas
                            </label>
                            <input
                                id="cuentas"
                                type="text"
                                placeholder="xx, xx, xx"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                                value={formData.cuentas}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Grupos */}
                        <div className="space-y-2">
                            <label htmlFor="grupos" className="block text-sm font-medium text-gray-700">
                                Grupos
                            </label>
                            <input
                                id="grupos"
                                type="text"
                                placeholder="Grupo xx, grupo xx"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                                value={formData.grupos}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Tareas */}
                        <DynamicInputGroup
                            label="Tareas Generales"
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

                        {/* Flujo de Trabajo */}
                        <DynamicInputGroup
                            label="Flujo de Trabajo"
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

                        {/* Condición */}
                        <Select
                            id="condicion"
                            label="Desarrollo?"
                            value={formData.condicion}
                            onChange={(value) => handleSelectChange(value, 'condicion')}
                            placeholder="Seleccione una condición"
                            options={condicionOptions}
                        />

                        {formData.condicion === 'si' ? (
                            <DynamicInputGroup
                                label="Desarrollos"
                                type="text"
                                placeholder="Ingrese un desarrollo"
                                values={formData.desarrollos}
                                onChange={(newValues) => {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        desarrollos: newValues,
                                    }));
                                }}
                            />
                        ) : formData.condicion === 'no' ? (
                            <DynamicInputGroup
                                label="Configuraciones Especiales"
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
                        ) : null}

                        {/* Integración */}
                        <div className="space-y-2">
                            <label htmlFor="integracion" className="block text-sm font-medium text-gray-700">
                                Integración
                            </label>
                            <input
                                id="integracion"
                                type="text"
                                placeholder="Detalles de integración"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                                value={formData.integracion}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Subida de archivo PDF */}
                        <div className="space-y-2">
                            <label htmlFor="archivoPdf" className="block text-sm font-medium text-gray-700">
                                Ficha Tecnica
                            </label>
                            <input
                                id="archivoPdf"
                                type="file"
                                ref={pdfInputRef}
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-700 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold hover:file:bg-gray-100"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-fulls mt-4 py-2 px-4 bg-gdwNegro text-white font-semibold rounded-md shadow hover:bg-gdwNegro disabled:bg-gray-400"
                    >
                        {loading ? 'Subiendo...' : 'Guardar Documento'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Upload;
