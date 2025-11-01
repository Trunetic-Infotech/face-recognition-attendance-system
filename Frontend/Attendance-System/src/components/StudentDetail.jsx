// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useEffect, useState } from "react";

// export default function StudentDetail() {
//   const { id } = useParams();
//   const [student, setStudent] = useState(null);

//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/student/${id}`)
//       .then((res) => setStudent(res.data))
//       .catch((err) => console.error(err));
//   }, [id]);

//   const downloadReport = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/report/${id}`, {
//         responseType: "blob",
//       });

//       const blob = new Blob([res.data], { type: "application/pdf" });
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${student.name}_attendance_report.pdf`;
//       a.click();

//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Download Error:", err);
//       alert("Report download failed!");
//     }
//   };

//   if (!student) return <h2 className="text-gray-800">Loading...</h2>;

//   return (
//     <div className="p-6 text-gray-800">
//       {/* HEADER */}
//       <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg flex gap-6 items-center">
//         <img
//           src={student.image_url}
//           alt="face"
//           className="w-28 h-28 rounded-xl object-cover border border-gray-300 shadow-sm"
//         />

//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
//           <p className="text-gray-600 text-lg">
//             <strong>Roll:</strong> {student.roll_no}
//           </p>
//           <p className="text-blue-600 text-lg font-semibold">
//             Total Attendance: {student.total_attendance}%
//           </p>
//         </div>
//       </div>

//       {/* ATTENDANCE STATS */}
//       <div className="grid md:grid-cols-3 gap-4 my-6">
//         <div className="bg-white border border-gray-200 p-4 rounded-xl text-center shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800">Weekly</h3>
//           <p className="text-blue-600 text-2xl font-bold">
//             {student.weekly_attendance}%
//           </p>
//         </div>
//         <div className="bg-white border border-gray-200 p-4 rounded-xl text-center shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800">Monthly</h3>
//           <p className="text-blue-600 text-2xl font-bold">
//             {student.monthly_attendance}%
//           </p>
//         </div>
//         <div className="bg-white border border-gray-200 p-4 rounded-xl text-center shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800">Yearly</h3>
//           <p className="text-blue-600 text-2xl font-bold">
//             {student.yearly_attendance}%
//           </p>
//         </div>
//       </div>

//       {/* DOWNLOAD REPORT */}
//       <button
//         onClick={downloadReport}
//         className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-xl
//         hover:bg-blue-700 transition shadow-md">
//         📄 Download Attendance Report
//       </button>

//       {/* FULL HISTORY TABLE */}
//       <h2 className="mt-8 text-2xl font-semibold text-gray-900">
//         Full Attendance History
//       </h2>

//       {student.history?.length > 0 ? (
//         <div className="overflow-x-auto mt-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
//           <table className="min-w-full text-left">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-2 px-4 font-semibold">Date</th>
//                 <th className="py-2 px-4 font-semibold">Day</th>
//                 <th className="py-2 px-4 font-semibold">Time</th>
//                 <th className="py-2 px-4 font-semibold">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {student.history.map((h, i) => (
//                 <tr
//                   key={i}
//                   className="border-b last:border-b-0 hover:bg-gray-50 transition">
//                   <td className="py-2 px-4">{h.date}</td>
//                   <td className="py-2 px-4">{h.day}</td>
//                   <td className="py-2 px-4">{h.time}</td>
//                   <td
//                     className={`py-2 px-4 font-semibold ${
//                       h.status === "Present" ? "text-green-600" : "text-red-600"
//                     }`}>
//                     {h.status}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p className="mt-4 text-gray-600">No attendance history found.</p>
//       )}
//     </div>
//   );
// }

import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  // after getting student from API
  const weekly =
    Object.values(student?.attendance_history?.weekly ?? {})[0] ?? 0;
  const monthly =
    Object.values(student?.attendance_history?.monthly ?? {})[0] ?? 0;
  const yearly =
    Object.values(student?.attendance_history?.yearly ?? {})[0] ?? 0;

  // Fetch student data
  useEffect(() => {
    axios
      .get(`http://localhost:5000/student/${id}`)
      .then((res) => setStudent(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // Download PDF

  const downloadReport = () => {
    console.log(student);

    if (!student) return;

    const doc = new jsPDF();
    let line = 20;

    const addLine = (text) => {
      doc.text(text, 14, line);
      line += 8;
    };

    // Extract weekly/monthly/yearly values
    const weekly_attendance =
      Object.values(student.attendance_history?.weekly ?? {})[0] ?? 0;

    const monthly_attendance =
      Object.values(student.attendance_history?.monthly ?? {})[0] ?? 0;

    const yearly_attendance =
      Object.values(student.attendance_history?.yearly ?? {})[0] ?? 0;

    // Title
    doc.setFontSize(18);
    doc.text(`${student.name} - Attendance Report`, 14, 15);
    doc.setFontSize(12);

    // Basic Info
    addLine(`Roll No: ${student.roll_no}`);
    addLine(`Class: ${student.class_name}`);
    addLine(`Division: ${student.division}`);
    addLine(`Standing: ${student.standing}`);
    addLine(`Starting Year: ${student.starting_year}`);
    addLine(`Last Attendance: ${student.last_attendance_time}`);
    addLine(`Total Attendance: ${student.total_attendance}`);

    line += 5;
    doc.setFontSize(14);
    addLine("Attendance Summary:");
    doc.setFontSize(12);

    addLine(`Weekly Attendance: ${weekly_attendance}`);
    addLine(`Monthly Attendance: ${monthly_attendance}`);
    addLine(`Yearly Attendance: ${yearly_attendance}`);

    doc.save(`${student.name}_Attendance_Report.pdf`);
  };

  function formatAttendanceHistory(history) {
    if (!history) return [];

    const formatted = [];

    // ✅ DAILY
    if (history.daily) {
      Object.entries(history.daily).forEach(([date, val]) => {
        const d = new Date(date);
        formatted.push({
          date,
          day: d.toLocaleDateString("en-US", { weekday: "long" }),
          time: "--",
          status: val === 1 ? "Present" : "Absent",
        });
      });
    }

    return formatted;
  }
  const attendanceHistory = formatAttendanceHistory(
    student?.attendance_history
  );

  if (!student) return <h2 className="text-gray-800">Loading...</h2>;

  // Calculate total attendance dynamically for frontend display
  const totalDays = student.history?.length || 0;
  const presentDays =
    student.history?.filter((h) => h.status === "Present").length || 0;
  const totalAttendance = totalDays
    ? Math.round((presentDays / totalDays) * 100)
    : 0;

  return (
    <div className="p-6 text-gray-800">
      {/* HEADER */}
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg flex gap-6 items-center">
        <img
          src={student.image_url}
          alt="face"
          className="w-28 h-28 rounded-xl object-cover border border-gray-300 shadow-sm"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-gray-600 text-lg">
            <strong>Roll:</strong> {student.roll_no}
          </p>
          <p className="text-blue-600 text-lg font-semibold">
            Total Attendance: {student.total_attendance}
          </p>
        </div>
      </div>

      {/* ATTENDANCE STATS */}
      <div className="grid md:grid-cols-3 gap-4 my-6">
        <div className="bg-white border border-gray-200 p-4 rounded-xl text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">Weekly</h3>
          <p className="text-blue-600 text-2xl font-bold">{weekly}%</p>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-xl text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">Monthly</h3>
          <p className="text-blue-600 text-2xl font-bold">{monthly}%</p>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-xl text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">Yearly</h3>
          <p className="text-blue-600 text-2xl font-bold">{yearly}%</p>
        </div>
      </div>

      {/* DOWNLOAD REPORT */}
      <button
        onClick={downloadReport}
        className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition shadow-md">
        📄 Download Attendance Report
      </button>

      {/* FULL HISTORY TABLE */}
      <h2 className="mt-8 text-2xl font-semibold text-gray-900">
        Full Attendance History
      </h2>

      {attendanceHistory.length > 0 ? (
        <div className="overflow-x-auto mt-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 font-semibold">Date</th>
                <th className="py-2 px-4 font-semibold">Day</th>
                <th className="py-2 px-4 font-semibold">Time</th>
                <th className="py-2 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceHistory.map((h, i) => (
                <tr
                  key={i}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition">
                  <td className="py-2 px-4">{h.date}</td>
                  <td className="py-2 px-4">{h.day}</td>
                  <td className="py-2 px-4">{h.time}</td>
                  <td
                    className={`py-2 px-4 font-semibold ${
                      h.status === "Present" ? "text-green-600" : "text-red-600"
                    }`}>
                    {h.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No attendance history found.</p>
      )}
    </div>
  );
}
