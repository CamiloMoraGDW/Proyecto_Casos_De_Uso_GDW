import React, { useState, useEffect } from 'react';
import { firestore } from '../../credenciales_firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Select from '../components/select'; // Asumiendo que ya tienes este componente para selects

function SearchPage() {
    const [docs, setDocs] = useState([]);          // Almacenamos los documentos de Firestore
    const [filteredDocs, setFilteredDocs] = useState([]);  // Almacenamos los documentos filtrados
    const [searchTerm, setSearchTerm] = useState('');  // Término de búsqueda
    const [selectedVertical, setSelectedVertical] = useState(''); // Filtro de vertical
    const [selectedCondicion, setSelectedCondicion] = useState(''); // Filtro de condición
    const [loading, setLoading] = useState(true);

    const verticalOptions = [
        { value: '', label: 'Todos' },
        { value: 'service', label: 'Service' },
        { value: 'trade', label: 'Trade' },
    ];

    const condicionOptions = [
        { value: '', label: 'Todos' },
        { value: 'si', label: 'SI' },
        { value: 'no', label: 'NO' },
    ];

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

    // Función para manejar el término de búsqueda
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        filterDocs(term, selectedVertical, selectedCondicion);
    };

    // Función para manejar los filtros de vertical y condición
    const handleFilterChange = (id, value) => {
        if (id === 'vertical') {
            setSelectedVertical(value);
            filterDocs(searchTerm, value, selectedCondicion);
        } else if (id === 'condicion') {
            setSelectedCondicion(value);
            filterDocs(searchTerm, selectedVertical, value);
        }
    };

    // Función para filtrar los documentos
    const filterDocs = (term, vertical, condicion) => {
        let filtered = docs;

        if (term) {
            filtered = filtered.filter((doc) =>
                doc.nombre.toLowerCase().includes(term) ||
                doc.cliente.toLowerCase().includes(term) ||
                doc.pais.toLowerCase().includes(term)
            );
        }

        if (vertical) {
            filtered = filtered.filter((doc) => doc.vertical === vertical);
        }

        if (condicion) {
            filtered = filtered.filter((doc) => doc.condicion === condicion);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        id="vertical"
                        label="Vertical"
                        value={selectedVertical} ee
                        onChange={(value) => handleFilterChange('vertical', value)}
                        options={verticalOptions}
                    />
                    <SelectdSSSSA
                        id="condicion"
                        label="Condición"
                        value={selectedCondicion}
                        onChange={(value) => handleFilterChange('condicion', value)}
                        options={condicionOptions}
                    />
                </div>

                {/* Mostrar resultados */}
                {loading ? (
                    <p className="text-center">Cargando documentos...</p>
                ) : filteredDocs.length > 0 ? (
                    <div className="mx-auto w-72 h-60 bg-indigo-300 cursor-pointer hover:bg-gradient-to-t from-indigo-300 via-indigo-400 to-indigo-500 transition-all duration-300 ease-in-out flex justify-center items-center                                                                                                                                 ">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredDocs.map((doc) => (
                                <div key={doc.id} className="p-4 bg-gray-50 border rounded-md">
                                    <h3 className="text-xl font-bold">{doc.nombre}</h3>
                                    <p><strong>Cliente:</strong> {doc.cliente}</p>
                                    <p><strong>País:</strong> {doc.pais}</p>
                                    <p><strong>Vertical:</strong> {doc.vertical}</p>
                                    <p><strong>Condición:</strong> {doc.condicion}</p>
                                    <a
                                        href={doc.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Ver PDF
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No se encontraron documentos.</p>
                )}
            </div>
        </div>
    );
}

export default SearchPage;
