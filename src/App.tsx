import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import './App.css';

import { BacklogPage } from './modules/backlog/pages/backlog/backlog-page';
import { DashboardPage } from './modules/dashboard/pages/dashboard/dashboard-page';
import { MainMenu } from './shared/components/main-menu/main-menu';
import { SideMenu } from './shared/components/side-menu/side-menu';
import { DetailPage } from './modules/backlog/pages/detail/detail-page';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
    return (
      <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <React.Fragment>
          <MainMenu />
          <div className="container-fluid">
            <div className="row">

              <SideMenu></SideMenu>

              <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                <Routes>
                  <Route path="dashboard" element={<DashboardPage/>} />
                  <Route path="/" element={<Navigate replace to="/dashboard" />} />
                  <Route path="backlog" element={<Navigate replace to="/backlog/open" />}/>
                  <Route path="/backlog/:preset" element={<BacklogPage/>} />

                  <Route path="/detail/:id" element={<DetailPage/>} />
                  <Route path="/detail/:id/:screen" element={<DetailPage/>} />
                </Routes>
              </main>
            </div>
          </div>
        </React.Fragment>
      </BrowserRouter>
      </QueryClientProvider>
    );
}

export default App;
