import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SchedulerMain from './pages/SchedulerMain';
import TeamCapacity from './pages/TeamCapacity';
import ConflictResolution from './pages/ConflictResolution';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SchedulerMain />} />
                <Route path="/team/:teamId" element={<TeamCapacity />} />
                <Route path="/conflicts" element={<ConflictResolution />} />
            </Routes>
        </BrowserRouter>
    );
}
