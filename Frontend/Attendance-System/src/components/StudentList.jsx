import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentCard from "./StudentCard";
import { useNavigate } from "react-router-dom";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/students")
      .then((res) => {
        console.log(res);

        const arr = Object.entries(res.data).map(([id, s]) => ({
          id,
          ...s,
        }));
        setStudents(arr);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {students.map((s) => (
        <StudentCard
          key={s.id}
          student={s}
          onClick={() => navigate(`/student/${s.id}`)}
        />
      ))}
    </div>
  );
}
