import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Login from './pages/login';
import Header from './components/header';
import PrivateRoute from './PrivatesRoutes';
import Loading from './components/loading_circle'; // Importa el componente de animación
import firebaseApp from '../credenciales_firebase';
import List from './pages/list';
import Upload from './pages/upload';
import Profile from './pages/profile';
import Home from './pages/home';



const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function App() {
  const [usuarioGlobal, setUsuarioGlobal] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuarioGlobal(usuarioFirebase);
        const docRef = doc(firestore, 'CDUusers', usuarioFirebase.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        } else {
          setRole(null);
        }
      } else {
        setUsuarioGlobal(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />; // Muestra una animación de carga mientras se cargan los datos
  }

  return (
    <>

      {usuarioGlobal ? (
        <>
          <div className="app-container">
            <Header />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lista-cdus" element={<List />} />
                <Route
                  path="/agregar-cdu"
                  element={
                    <PrivateRoute usuarioGlobal={{ ...usuarioGlobal, role }} allowedRoles={['admin']}>
                      <Upload />
                    </PrivateRoute>
                  }
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </>
  );
}

export default App;