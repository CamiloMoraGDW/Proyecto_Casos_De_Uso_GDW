import React from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { firestore, auth, storage } from "../../credenciales_firebase"


function Home() {
    return (
        <>
            <h1>Pantalla Principal</h1>
            <button className='signOut' onClick={() => signOut(auth)}>Cerrar Sesión</button>
        </>
    )
}


export default Home