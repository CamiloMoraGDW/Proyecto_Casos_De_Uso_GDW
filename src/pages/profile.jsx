import { onAuthStateChanged, signOut } from "firebase/auth"
import { firestore, auth, storage } from "../../credenciales_firebase"

function Profile() {
    return (
        <>
            <div className="animate-blurred-fade-in duration-100">

                <h1>Profile Section</h1>
                <button className='signOut' onClick={() => signOut(auth)}>Cerrar Sesión</button>
            </div>
        </>
    )
}

export default Profile