import React, { useEffect , useState} from 'react';
import { Route, Routes } from 'react-router-dom';
import { authProtectedRoutes, publicRoutes } from './allRoutes';
import { StagiaireauthProtectedRoutes, StagiairepublicRoutes } from 'Stagiaire/Routes/allRoutes';
import ParrainLayout from 'Parrain/Layout';
import StagiaireLayout from '../../Stagiaire/Layout';
import NonAuthLayout from 'Parrain/Layout/NonLayout';
import AuthProtected from './AuthProtected';

const RouteIndex = () => {
  
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Retrieve isAdmin value from localStorage
    const isAdminValue = localStorage.getItem('isAdmin');
    setIsAdmin(isAdminValue === 'true');
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <Routes>
        {isAdmin ? (
          authProtectedRoutes.map((route: any, idx: number) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <AuthProtected>
                  <ParrainLayout>
                    <route.component />
                  </ParrainLayout>
                </AuthProtected>
              }
            />
          ))
        ) : (
          StagiaireauthProtectedRoutes.map((route: any, idx: number) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <AuthProtected>
                  <StagiaireLayout>
                    <route.component />
                  </StagiaireLayout>
                </AuthProtected>
              }
            />
          ))
        )}
        {publicRoutes.map((route: any, idx: number) => (
          <Route
            path={route.path}
            key={idx}
            element={
              <NonAuthLayout>
                <route.component />
              </NonAuthLayout>
            }
          />
        ))}
        {isAdmin ? null : (
          StagiairepublicRoutes.map((route: any, idx: number) => (
            <Route
              path={route.path}
              key={idx}
              element={
                <NonAuthLayout>
                  <route.component />
                </NonAuthLayout>
              }
            />
          ))
        )}
      </Routes>
    </React.Fragment>
  );
};

export default RouteIndex;
