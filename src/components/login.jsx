const { useState } = require("react")

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [shown, setShown] = useState("")


    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Columna izquierda: Imagen y texto descriptivo */}
            <div className="w-full md:w-1/2 bg-gray-100 flex flex-col items-center justify-center p-8 text-center">
                <Image
                    src="/placeholder.svg?height=100&width=300"
                    alt="Logo de la empresa"
                    width={300}
                    height={100}
                    className="mb-8"
                />
                <h1 className="text-3xl font-bold mb-4">Bienvenido a Nuestra Plataforma</h1>
                <p className="text-gray-600 max-w-md">
                    Accede a tu cuenta para gestionar tus proyectos, colaborar con tu equipo y aumentar la productividad de tu empresa.
                </p>
            </div>

            {/* Columna derecha: Formulario de inicio de sesión */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input id="email" placeholder="tu@email.com" required type="email" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password">Contraseña</label>
                            <input id="password" required type="password" />
                        </div>
                        <button className="w-full" type="submit">
                            Iniciar Sesión
                        </button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <Link className="text-blue-600 hover:underline" href="#">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <div className="mt-6 text-center text-sm">
                        ¿No tienes una cuenta?{" "}
                        <Link className="text-blue-600 hover:underline" href="#">
                            Regístrate aquí
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}