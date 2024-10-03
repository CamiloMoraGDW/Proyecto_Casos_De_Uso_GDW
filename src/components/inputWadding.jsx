import React, { useState } from 'react';

const DynamicInputGroup = ({ label, type = "text", placeholder, values, onChange }) => {
    const [inputs, setInputs] = useState(values);

    // Función para agregar un nuevo input
    const handleAddInput = () => {
        if (inputs.length < 10) { // Limitar a 10 inputs
            const newInputs = [...inputs, ''];
            setInputs(newInputs);
            onChange(newInputs);
        }
    };

    // Función para actualizar el valor de un input específico
    const handleInputChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
        onChange(newInputs);
    };

    // Función para eliminar un input
    const handleRemoveInput = (index) => {
        const newInputs = inputs.filter((_, i) => i !== index);
        setInputs(newInputs);
        onChange(newInputs);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            {inputs.map((input, index) => (
                <div key={index} className="flex space-x-2 items-center">
                    <input
                        type={type}
                        value={input}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        placeholder={placeholder}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gdwNegro focus:border-gdwNegro sm:text-sm"
                    />
                    {inputs.length > 1 && (
                        <button
                            type="button"
                            onClick={() => handleRemoveInput(index)}
                            className="bg-gdwNegro text-white px-3 py-1 rounded-md hover:bg-red-700"
                        >
                            X
                        </button>
                    )}
                </div>
            ))}
            {inputs.length < 10 && (
                <button
                    type="button"
                    onClick={handleAddInput}
                    className="mt-2 px-3 py-1 bg-gdwNegro text-white rounded-md hover:bg-blue-700"
                >
                    Agregar {label}
                </button>
            )}
        </div>
    );
};

export default DynamicInputGroup;
