import React, { useState, useEffect } from 'react';
import { firestore } from '../../credenciales_firebase';
import { collection, getDocs } from 'firebase/firestore';
import Select from '../components/select'; // Asumiendo que ya tienes este componente para selects

function List() {
    const [docs, setDocs] = useState([]);          // Almacenamos los documentos de Firestore
    const [filteredDocs, setFilteredDocs] = useState([]);  // Almacenamos los documentos filtrados
    const [searchTerm, setSearchTerm] = useState('');  // Término de búsqueda
    const [selectedVertical, setSelectedVertical] = useState(''); // Filtro de vertical
    const [selectedCondicion, setSelectedCondicion] = useState(''); // Filtro de condición
    const [selectedCliente, setSelectedCliente] = useState(''); // Filtro de cliente
    const [selectedPais, setSelectedPais] = useState(''); // Filtro de país
    const [selectedIntegracion, setSelectedIntegracion] = useState(''); // Filtro de integración
    const [loading, setLoading] = useState(true);

    // useEffect para cargar los documentos al montar el componente
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

    // Obtener opciones únicas dinámicas de los campos de los documentos
    const uniqueOptions = (field) => {
        const options = Array.from(new Set(docs.map((doc) => doc[field])));
        return [{ value: '', label: 'Todos' }, ...options.map((value) => ({ value, label: value }))];
    };

    const clientesOptions = uniqueOptions('cliente');
    const paisesOptions = uniqueOptions('pais');
    const verticalOptions = uniqueOptions('vertical');
    const condicionOptions = uniqueOptions('condicion');
    const integracionOptions = uniqueOptions('integracion');

    // Función para manejar el término de búsqueda
    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    // Función para manejar los filtros de cada campo
    const handleFilterChange = (id, value) => {
        switch (id) {
            case 'vertical':
                setSelectedVertical(value);
                break;
            case 'condicion':
                setSelectedCondicion(value);
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

    // Función para filtrar los documentos
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

        if (selectedCondicion) {
            filtered = filtered.filter((doc) => doc.condicion === selectedCondicion);
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
                        id="condicion"
                        label="Condición"
                        value={selectedCondicion}
                        onChange={(value) => handleFilterChange('condicion', value)}
                        options={condicionOptions}
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
                </div>

                {/* Botón de búsqueda */}
                <div className="flex justify-end">
                    <button
                        onClick={filterDocs}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                        Buscar
                    </button>
                </div>

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
                                <p><strong>Condición:</strong> {doc.condicion}</p>
                                <p><strong>Integración:</strong> {doc.integracion}</p>
                                <a
                                    href={doc.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Ver documento
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">No se encontraron documentos con esos filtros.</p>
                )}
            </div>
        </div>
    );
}

export default List;
