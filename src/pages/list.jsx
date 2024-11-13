import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../../credenciales_firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Select from '../components/select';
import Header from '../components/header';
import { IoIosBusiness } from "react-icons/io";
import { FaFlag } from "react-icons/fa";
import { AiFillAppstore } from "react-icons/ai";


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
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [showConfirmPopUp, setShowConfirmPopUp] = useState(false);
    const [userRole, setUserRole] = useState(null);

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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(firestore, 'CDUusers', user.uid));
                    if (userDoc.exists()) {
                        const role = userDoc.data().role;
                        console.log("Rol del usuario:", role); // Agrega esta línea para depurar
                        setUserRole(role);
                    } else {
                        console.log("El documento de usuario no existe.");
                    }
                } catch (error) {
                    console.error("Error al obtener el rol del usuario:", error);
                }
            }
        });
        return unsubscribe;
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
            await deleteDoc(doc(firestore, 'DocsTecnicos', selectedDoc.id));
            setDocs((prevDocs) => prevDocs.filter((d) => d.id !== selectedDoc.id));
            setFilteredDocs((prevFilteredDocs) => prevFilteredDocs.filter((d) => d.id !== selectedDoc.id));
            setSelectedDoc(null);
        } catch (error) {
            console.error('Error eliminando el documento:', error);
        }
    };

    const confirmDelete = () => {
        setShowConfirmPopUp(true);
    };

    const cancelDelete = () => {
        setShowConfirmPopUp(false);
    };

    const handleEdit = (doc) => {
        setSelectedDoc(doc)
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedVertical('');
        setSelectedCustomizacion('');
        setSelectedCliente('');
        setSelectedPais('');
        setSelectedIntegracion('');
        setFilteredDocs(docs);
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100 flex justify-center pt-20 md:pt-28 lg:pt-20 lg:pb-20 px-4 md:px-8">
                <div className="bg-white shadow-2xl rounded-lg w-full max-w-6xl p-6 space-y-6">
                    <div className="w-full flex justify-center bg-gray-300 rounded-lg m-1 py-1">
                        <h2 className="text-2xl font-bold text-center text-gray-800">Buscar Documentos Técnicos</h2>
                    </div>

                    <div className="w-full">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, cliente o país"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full p-3 border border-gray-300 rounded-md"
                        />
                    </div>

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
                                className="h-10 w-1/2 bg-gdwNegro text-white px-10 py-1 rounded-md duration-200 hover:w-2/3"
                            >
                                Buscar
                            </button>
                            <button
                                onClick={clearFilters}
                                className="h-10 w-1/2 bg-gray-300 text-gray-700 px-10 py-1 ml-4 rounded-md duration-200 hover:w-2/3"
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-center">Cargando documentos...</p>
                    ) : filteredDocs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredDocs.map((doc) => (
                                <div key={doc.id} className="p-6 bg-gray-50 border border-gray-200 rounded-lg duration-300 hover:shadow-lg hover:duration-300">
                                    <div className="w-full flex justify-center bg-gray-300 rounded-lg m-1 py-1">
                                        <h3 className="text-xl font-bold text-gdwNegro">{doc.nombre}</h3>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <p className="text-gray-600"><strong>Cliente:</strong> {doc.cliente}</p>
                                        <p className="text-gray-600"><strong>País:</strong> {doc.pais}</p>
                                        <p className="text-gray-600"><strong>Vertical:</strong> {doc.vertical}</p>
                                        <p className="text-gray-600"><strong>Customización:</strong> {doc.customizacion}</p>
                                        <p className="text-gray-600"><strong>Integración:</strong> {doc.integracion}</p>
                                    </div>
                                    <div className="flex justify-center items-center">

                                        <button
                                            onClick={() => handleInspect(doc)}
                                            className="w-2/3 bg-gdwNegro text-white px-4 py-2 mt-4 rounded-md hover:w-3/4 hover:duration-300 duration-300"
                                        >
                                            Inspeccionar
                                        </button>
                                    </div>
                                    {userRole === 'admin' && (
                                        <div className="flex justify-between mt-4">
                                            <button onClick={() => handleEdit(doc)} className="text-sm text-gdwAzul">Editar</button>
                                            <button onClick={confirmDelete} className="text-sm text-red-500">Eliminar</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-red-900">No se encontraron documentos con esos filtros.</p>
                    )}

                    {selectedDoc && (
                        <div className="fixed h-full mt-0 inset-0 z-50 flex items-center justify-center bg-gdwNegro bg-opacity-50 gap-y-3">
                            <div className="bg-white p-6 w-full max-w-3xl rounded-lg relative">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">{selectedDoc.nombre}</h3>
                                    <button
                                        onClick={handleClose}
                                        className="top-4 right-4 bg-gdwNegro text-white px-3 py-1 rounded-md hover:bg-red-700"
                                    >
                                        X
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                                    <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                        <IoIosBusiness className="text-gray-600 text-2xl mr-4" />
                                        <div className="flex flex-col w-2/3">
                                            <span className="text-gray-500 font-semibold">Cliente</span>

                                            <span className="text-gray-800 font-medium text-lg">{selectedDoc.cliente}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                        <FaFlag className="text-gray-600 text-2xl mr-4" />
                                        <div className="flex flex-col w-2/3">
                                            <span className="text-gray-500 font-semibold">Pais</span>

                                            <span className="text-gray-800 font-medium text-lg">{selectedDoc.pais}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                        <AiFillAppstore className="text-gray-600 text-2xl mr-4" />
                                        <div className="flex flex-col w-2/3">
                                            <span className="text-gray-500 font-semibold">Vertical</span>

                                            <span className="text-gray-800 font-medium text-lg">{selectedDoc.vertical}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                        <IoIosBusiness className="text-gray-600 text-2xl mr-4" />
                                        <div className="flex flex-col w-2/3">
                                            <span className="text-gray-500 font-semibold">Cuentas</span>

                                            <span className="text-gray-800 font-medium text-lg">{selectedDoc.cuentas}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                        <IoIosBusiness className="text-gray-600 text-2xl mr-4" />
                                        <div className="flex flex-col w-2/3">
                                            <span className="text-gray-500 font-semibold">Grupos</span>

                                            <span className="text-gray-800 font-medium text-lg">{selectedDoc.grupos}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                        <IoIosBusiness className="text-gray-600 text-2xl mr-4" />
                                        <div className="flex flex-col w-2/3">
                                            <span className="text-gray-500 font-semibold">Tareas</span>

                                            <span className="text-gray-800 font-medium text-lg">{selectedDoc.grupos}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                        <IoIosBusiness className="text-gray-600 text-2xl mr-4" />
                                        <div className="flex flex-col w-2/3">
                                            <span className="text-gray-500 font-semibold">Flujos de Trabajo</span>

                                            <span className="text-gray-800 font-medium text-lg">{selectedDoc.flujoTrabajo}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                        <IoIosBusiness className="text-gray-600 text-2xl mr-4" />
                                        <div className="flex flex-col w-2/3">
                                            <span className="text-gray-500 font-semibold">Customizacion</span>

                                            <span className="text-gray-800 font-medium text-lg">{selectedDoc.condicion}</span>
                                        </div>
                                    </div>
                                    {selectedDoc.condicion === "si" || "SI" ?
                                        <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                            <IoIosBusiness className="text-gray-600 text-2xl mr-4" />
                                            <div className="flex flex-col w-2/3">
                                                <span className="text-gray-500 font-semibold">Desarrollos</span>

                                                <span className="text-gray-800 font-medium text-lg">{selectedDoc.desarrollos}</span>
                                            </div>
                                        </div>
                                        :
                                        <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                            <IoIosBusiness className="text-gray-600 text-2xl mr-4" />
                                            <div className="flex flex-col w-2/3">
                                                <span className="text-gray-500 font-semibold">Configuraciones Especiales</span>
                                                <span className="text-gray-800 font-medium text-lg">{selectedDoc.configuraciones}</span>
                                            </div>
                                        </div>
                                    }
                                    <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm border-b-2 border-gray-300">
                                        <IoIosBusiness className="text-gray-600 text-2xl mr-4" />
                                        <div className="flex flex-col w-2/3">
                                            <span className="text-gray-500 font-semibold">Integración</span>
                                            <span className="text-gray-800 font-medium text-lg">{selectedDoc.integracion}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Mostrar video */}
                                {selectedDoc.videoUrl && (
                                    <div className="flex justify-center mt-4">
                                        <iframe
                                            src={selectedDoc.videoUrl}
                                            title="Video"
                                            className="w-2/3 h-64 rounded-lg border-solid border-4"
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
                                        className="w-1/3 bg-gdwNegro text-white px-6 py-3 mt-4 text-center rounded-md duration-200 hover:w-2/4 hover:duration-200"
                                    >
                                        Ver Ficha Tecnica
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default List;