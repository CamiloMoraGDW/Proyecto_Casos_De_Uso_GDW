import React from "react"

function Login() {
    return (
        <>
            <div className="flex min-h-screen">
                {/* Left Side */}
                <div className="hidden w-1/2 flex-col justify-center bg-gray-100 p-12 lg:flex">
                    <div className="mb-8">
                        <img
                            src="/placeholder.svg?height=100&width=300"
                            alt="Logo de la empresa"
                            width={300}
                            height={100}
                            className="dark:invert"
                        />
                    </div>
                    <h1 className="mb-4 text-4xl font-bold">Bienvenido a Portal de Casos de Uso</h1>
                    <p className="text-xl text-gray-600">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum placeat harum beatae voluptatibus soluta quod asperiores numquam. Facere in magnam maxime quia enim atque, dolor magni sapiente delectus inventore unde!
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login