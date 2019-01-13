import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BacklogPage } from './modules/backlog/pages/backlog/backlog-page';





class App extends Component {
  render() {
    return (

      <div className="container-fluid">
        <div className="row">

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <BacklogPage />
          </main>
        </div>
      </div>

    );
  }
}

export default App;
