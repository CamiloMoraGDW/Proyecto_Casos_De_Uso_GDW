import React, { useState } from 'react';

function CustomFileInput() {
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName("");
        }
    };

    return (
        <>
            <div className=" w-full flex justify-center items-end gap-1">
                {/* Input file oculto */}
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Botón personalizado para seleccionar archivo */}
                <label
                    htmlFor="fileInput"
                    className="cursor-pointer bg-gdwNegro text-white py-1 px-2 rounded-md hover:bg-gdwNegro/80 transition-colors"
                >
                    Archivo +
                </label>

                {/* Mostrar el nombre del archivo seleccionado */}
                <span className="ml-2 text-sm text-gray-600">
                    {fileName ? fileName : "No File..."}
                </span>
            </div>
        </>
    );
}

export default CustomFileInput;
