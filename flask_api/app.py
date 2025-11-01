# from flask import Flask, jsonify
# from flask_cors import CORS
# import firebase_admin
# from firebase_admin import credentials, db
# import os

# # Initialize Flask
# app = Flask(__name__)
# CORS(app)

# # Initialize Firebase
# cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
# if not firebase_admin._apps:
#     cred = credentials.Certificate(cred_path)
#     firebase_admin.initialize_app(cred, {
#         'databaseURL': "https://faceattendancerealtime-7966d-default-rtdb.firebaseio.com/"
#     })

# students_ref = db.reference("Students")

# @app.route("/students", methods=["GET"])
# def get_students():
#     students = students_ref.get() or {}
#     return jsonify(students)

# @app.route("/student/<student_id>", methods=["GET"])
# def get_student(student_id):
#     student = students_ref.child(student_id).get()
#     if student:
#         return jsonify(student)
#     return jsonify({"error": "Student not found"}), 404

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)


from flask import Flask, jsonify, send_file
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table
from reportlab.lib.styles import getSampleStyleSheet
import os

# ---------------------------
# Initialize Flask & CORS
# ---------------------------
app = Flask(__name__)
CORS(app)

# ---------------------------
# Initialize Firebase
# ---------------------------
cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred, {
        'databaseURL': "https://faceattendancerealtime-7966d-default-rtdb.firebaseio.com/"
    })

students_ref = db.reference("Students")

# ---------------------------
# Get all students
# ---------------------------
@app.route("/students", methods=["GET"])
def get_students():
    students = students_ref.get() or {}
    return jsonify(students)

# ---------------------------
# Get single student by ID
# ---------------------------
@app.route("/student/<student_id>", methods=["GET"])
def get_student(student_id):
    student = students_ref.child(student_id).get()
    if student:
        return jsonify(student)
    return jsonify({"error": "Student not found"}), 404

# ---------------------------
# Generate PDF report
# ---------------------------
@app.route("/report/<student_id>", methods=["GET"])
def get_report(student_id):
    student = students_ref.child(student_id).get()

    if not student:
        return jsonify({"error": "Student not found"}), 404

    history = student.get("history", [])
    total_days = len(history)
    present_days = sum(1 for h in history if h.get("status") == "Present")
    percentage = round((present_days / total_days) * 100, 2) if total_days else 0

    pdf_file = f"{student_id}_report.pdf"
    doc = SimpleDocTemplate(pdf_file)
    styles = getSampleStyleSheet()
    story = []

    # Header
    story.append(Paragraph("Student Attendance Report", styles['Title']))
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"Name: {student.get('name', 'N/A')}", styles['Normal']))
    story.append(Paragraph(f"Roll No.: {student.get('roll_no', 'N/A')}", styles['Normal']))
    story.append(Paragraph(f"Total Attendance: {percentage}%", styles['Normal']))
    story.append(Spacer(1, 12))

    # Attendance Table
    table_data = [["Date", "Day", "Time", "Status"]]
    for h in history:
        table_data.append([
            h.get("date", ""),
            h.get("day", ""),
            h.get("time", ""),
            h.get("status", "")
        ])

    table = Table(table_data)
    story.append(table)

    doc.build(story)

    return send_file(pdf_file, as_attachment=True)


# ---------------------------
# Run Flask
# ---------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
