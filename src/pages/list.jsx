import React, { useState, useEffect } from 'react';
import { firestore } from '../../credenciales_firebase';
import { collection, getDocs } from 'firebase/firestore';
import Select from '../components/select';

function List() {
    const [docs, setDocs] = useState([]);
    const [filteredDocs, setFilteredDocs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVertical, setSelectedVertical] = useState('');
    const [selectedCustomizacion, setSelectedCustomizacion] = useState('');
    const [selectedCliente, setSelectedCliente] = useState('');
    const [selectedPais, setSelectedPais] = useState('');
    const [selectedIntegracion, setSelectedIntegracion] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState(null); // Estado para documento seleccionado
    const [showConfirmPopUp, setshowConfirmPopUp] = useState(false);

    useEffect(() => {
        const fetchDocs = async () => {
            setLoading(true);
            const q = collection(firestore, 'DocsTecnicos');
            const querySnapshot = await getDocs(q);
            const docsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDocs(docsData);
            setFilteredDocs(docsData);
            setLoading(false);
        };
        fetchDocs();
    }, []);

    const uniqueOptions = (field) => {
        const options = Array.from(new Set(docs.map((doc) => doc[field])));
        return [{ value: '', label: 'Todos' }, ...options.map((value) => ({ value, label: value }))];
    };

    const clientesOptions = uniqueOptions('cliente');
    const paisesOptions = uniqueOptions('pais');
    const verticalOptions = uniqueOptions('vertical');
    const customizacionOptions = uniqueOptions('customizacion');
    const integracionOptions = uniqueOptions('integracion');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleFilterChange = (id, value) => {
        switch (id) {
            case 'vertical':
                setSelectedVertical(value);
                break;
            case 'customizacion':
                setSelectedCustomizacion(value);
                break;
            case 'cliente':
                setSelectedCliente(value);
                break;
            case 'pais':
                setSelectedPais(value);
                break;
            case 'integracion':
                setSelectedIntegracion(value);
                break;
            default:
                break;
        }
    };

    const filterDocs = () => {
        let filtered = docs;

        if (searchTerm) {
            filtered = filtered.filter((doc) =>
                doc.nombre.toLowerCase().includes(searchTerm) ||
                doc.cliente.toLowerCase().includes(searchTerm) ||
                doc.pais.toLowerCase().includes(searchTerm)
            );
        }

        if (selectedVertical) {
            filtered = filtered.filter((doc) => doc.vertical === selectedVertical);
        }

        if (selectedCustomizacion) {
            filtered = filtered.filter((doc) => doc.customizacion === selectedCustomizacion);
        }

        if (selectedCliente) {
            filtered = filtered.filter((doc) => doc.cliente === selectedCliente);
        }

        if (selectedPais) {
            filtered = filtered.filter((doc) => doc.pais === selectedPais);
        }

        if (selectedIntegracion) {
            filtered = filtered.filter((doc) => doc.integracion === selectedIntegracion);
        }

        setFilteredDocs(filtered);
    };

    const handleInspect = (doc) => {
        setSelectedDoc(doc);
    };

    const handleClose = () => {
        setSelectedDoc(null);
    };

    const handleDelete = async () => {
        try {
            // Eliminar documento de Firestore
            await deleteDoc(doc(firestore, 'DocsTecnicos', selectedDoc.id));
            // Eliminar el documento de la lista local
            setDocs((prevDocs) => prevDocs.filter((d) => d.id !== selectedDoc.id));
            setFilteredDocs((prevFilteredDocs) => prevFilteredDocs.filter((d) => d.id !== selectedDoc.id));
            setSelectedDoc(null); // Cerrar el modal
        } catch (error) {
            console.error('Error eliminando el documento:', error);
        }
    };

    const confirmDelete = () => {
        setShowConfirmPopup(true);
    };

    const cancelDelete = () => {
        setShowConfirmPopup(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center pt-20 md:pt-28 lg:pt-20 lg:pb-20 px-4 md:px-8">
            <div className="bg-white shadow-2xl rounded-lg w-full max-w-6xl p-6 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">Buscar Documentos Técnicos</h2>

                {/* Campo de búsqueda */}
                <div className="w-full">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, cliente o país"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Select
                        id="vertical"
                        label="Vertical"
                        value={selectedVertical}
                        onChange={(value) => handleFilterChange('vertical', value)}
                        options={verticalOptions}
                    />
                    <Select
                        id="customizacion"
                        label="¿Customizacion?"
                        value={selectedCustomizacion}
                        onChange={(value) => handleFilterChange('customizacion', value)}
                        options={customizacionOptions}
                    />
                    <Select
                        id="cliente"
                        label="Cliente"
                        value={selectedCliente}
                        onChange={(value) => handleFilterChange('cliente', value)}
                        options={clientesOptions}
                    />
                    <Select
                        id="pais"
                        label="País"
                        value={selectedPais}
                        onChange={(value) => handleFilterChange('pais', value)}
                        options={paisesOptions}
                    />
                    <Select
                        id="integracion"
                        label="Integración"
                        value={selectedIntegracion}
                        onChange={(value) => handleFilterChange('integracion', value)}
                        options={integracionOptions}
                    />
                    <div className="flex justify-center items-end">
                        <button
                            onClick={filterDocs}
                            className="h-10 bg-gdwNegro text-white px-10 py-1 rounded-md duration-200 hover:px-14"
                        >
                            Buscar
                        </button>
                    </div>
                </div>

                {/* Botón de búsqueda */}

                {/* Mostrar resultados */}
                {loading ? (
                    <p className="text-center">Cargando documentos...</p>
                ) : filteredDocs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredDocs.map((doc) => (
                            <div key={doc.id} className="p-4 bg-gray-50 border rounded-md">
                                <h3 className="text-xl font-bold">{doc.nombre}</h3>
                                <p><strong>Cliente:</strong> {doc.cliente}</p>
                                <p><strong>País:</strong> {doc.pais}</p>
                                <p><strong>Vertical:</strong> {doc.vertical}</p>
                                <p><strong>Customizacion:</strong> {doc.customizacion}</p>
                                <p><strong>Integración:</strong> {doc.integracion}</p>
                                <button
                                    onClick={() => handleInspect(doc)}
                                    className="bg-gdwNegro text-white px-4 py-2 mt-2 rounded-md duration-200 hover:bg-blue-700 hover:duration-200"
                                >
                                    Inspeccionar
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">No se encontraron documentos con esos filtros.</p>
                )}

                {/* Modal para mostrar detalles del documento seleccionado */}
                {selectedDoc && (
                    <div className="fixed h-full mt-0 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 w-full max-w-3xl rounded-lg relative">
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 bg-gdwNegro text-white px-3 py-1 rounded-md hover:bg-red-700"
                            >
                                X
                            </button>
                            <h3 className="text-2xl font-bold mb-4">{selectedDoc.nombre}</h3>
                            <p><strong>Cliente:</strong> {selectedDoc.cliente}</p>
                            <p><strong>País:</strong> {selectedDoc.pais}</p>
                            <p><strong>Vertical:</strong> {selectedDoc.vertical}</p>
                            <p><strong>Cuentas:</strong> {selectedDoc.cuentas}</p>
                            <p><strong>Grupos:</strong> {selectedDoc.grupos}</p>
                            <p><strong>Tareas:</strong> {'' + selectedDoc.tareas}</p>
                            <p><strong>Flujos de Trabajo:</strong> {selectedDoc.flujoTrabajo}</p>
                            <p><strong>Customizacion:</strong> {selectedDoc.condicion}</p>
                            {selectedDoc.condicion === "si" || "SI" ?
                                <p><strong>Desarrollos:</strong> {selectedDoc.desarrollos}</p>
                                :
                                <p><strong>Configuraciones Especiales:</strong> {selectedDoc.configuraciones}</p>
                            }
                            <p><strong>Integración:</strong> {selectedDoc.integracion}</p>


                            {/* Mostrar video */}
                            {selectedDoc.videoUrl && (
                                <div className="flex justify-center mt-4">
                                    <iframe
                                        src={selectedDoc.videoUrl}
                                        title="Video"
                                        className="w-2/3 h-64"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                            {/* Botón para ver PDF */}
                            <div className="flex justify-center">
                                <a
                                    href={selectedDoc.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-64 bg-gdwNegro text-white px-6 py-3 mt-4 text-center rounded-md duration-200 hover:bg-gdwAzul hover:duration-200"
                                >
                                    Ver Ficha Tecnica
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default List;
