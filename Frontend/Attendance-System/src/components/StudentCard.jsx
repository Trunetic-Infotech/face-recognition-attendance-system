export default function StudentCard({ student, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-gradient-to-br from-[#ffffff] to-[#f4f7ff] 
      border border-gray-200 shadow-lg rounded-2xl p-5 text-gray-800
      hover:shadow-blue-300/50 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-4">
        <img
          src={student.image_url}
          alt="face"
          className="w-16 h-16 rounded-full border border-blue-300/50 shadow-sm object-cover"
        />

        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {student.name}
          </h2>

          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Roll:</span>{" "}
            {student.roll_no || "N/A"}
          </p>

          <p className="mt-1 text-sm">
            <span className="font-medium text-blue-500">Attendance:</span>{" "}
            <strong className="text-blue-600">
              {student.total_attendance ?? "0"}%
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
