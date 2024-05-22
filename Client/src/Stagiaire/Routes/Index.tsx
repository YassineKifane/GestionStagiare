import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { StagiaireauthProtectedRoutes, StagiairepublicRoutes } from './allRoutes';
import Layout from 'Parrain/Layout';
import NonAuthLayout from "Parrain/Layout/NonLayout"
import AuthProtected from './AuthProtected';

const RouteIndex = () => {
  return (
    <React.Fragment>
      <Routes>
        {StagiaireauthProtectedRoutes.map((route: any, idx: number) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <AuthProtected>
                <Layout>
                  <route.component />
                </Layout>
              </AuthProtected>
            }
          />
        ))}
        {StagiairepublicRoutes.map((route: any, idx: number) => (
          <Route
            path={route.path}
            key={idx}
            element={
              <NonAuthLayout>
                <route.component />
              </NonAuthLayout>
            } />
        ))}
      </Routes>
    </React.Fragment>
  );
};

export default RouteIndex;
