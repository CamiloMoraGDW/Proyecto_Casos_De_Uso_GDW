function Loading() {
    return (
        <>
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
                {/* Círculo de carga */}
                <div className="flex justify-center items-center space-x-2 anima">
                    <div className="w-16 h-16 border-4 border-gdwNegro border-t-transparent border-solid rounded-full"></div>
                </div>
                {/* Texto debajo del círculo */}
                <p className="mt-4 text-lg font-semibold text-gray-700">Cargando...</p>
            </div>
        </>
    )
}

export default Loading