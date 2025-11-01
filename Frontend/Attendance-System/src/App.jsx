import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentList from "./components/StudentList";
import StudentDetail from "./components/StudentDetail";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path="/student/:id" element={<StudentDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
