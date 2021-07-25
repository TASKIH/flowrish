import './css/App.scss';
import MyFlowChart from "./MyFlowChart";
import React from "react";
import {ReactFlowProvider} from "react-flow-renderer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
        <ReactFlowProvider>
            <MyFlowChart/>
        </ReactFlowProvider>
    </div>
  );
}

export default App;
