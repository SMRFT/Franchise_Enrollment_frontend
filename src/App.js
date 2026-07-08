import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import ResponsiveSidebar from './Components/sidebar';
import FranchiseLocations from './Components/FranchiseLocations';
import FranchiseRegister from './Components/FranchiseRegister';
import FranchiseList from './Components/FranchiseList';
import FranchiseDetails from './Components/FranchiseDetails';
import BarcodeToggleForm from './Components/BarcodeToggleForm';
import Preprintedbarcode from './Components/Preprintedbarcode';
import Barcodestock from './Components/Barcodestock';
import Cancelledbill from './Components/Cancelledbill';
import InactiveFranchises from './Components/InactiveFranchises';
import FinalBillcancel from './Components/FinalbillCancel';
import MonthEndCalculation from './Components/MonthEndCalculation';


function App() {
  return (
    <div style={{ display: 'flex' }}>
      <ResponsiveSidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<FranchiseRegister />} />
          <Route path="/FranchiseList" element={<FranchiseList />} />
          <Route path="/EmployeeDetails/:franchiseId" element={<FranchiseDetails />} />
          <Route path="/FranchiseLocations" element={<FranchiseLocations />} />
           <Route path="/BarcodeToggleForm" element={<BarcodeToggleForm />} />
            <Route path="/Preprintedbarcode" element={<Preprintedbarcode />} />
            <Route path="/Barcodestock" element={<Barcodestock/>} />
             <Route path="/InactiveFranchises" element={<InactiveFranchises/>} />
             <Route path="/Cancelledbill" element={<Cancelledbill/>} />
              <Route path="/FinalBillcancel" element={<FinalBillcancel/>} />
               <Route path="/MonthEndCalculation" element={<MonthEndCalculation/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
