from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table
from reportlab.lib.styles import getSampleStyleSheet
from firebase_admin import db

def generate_report(student_id):
    ref = db.reference(f"Attendance/{student_id}")
    data = ref.get()

    if not data:
        return None

    doc = SimpleDocTemplate(f"{student_id}.pdf")
    styles = getSampleStyleSheet()
    story = []

    student_name = data["name"]
    roll = data["roll"]
    history = data["history"]

    total_days = len(history)
    present_days = sum(1 for h in history if h["status"] == "Present")
    percentage = round((present_days / total_days) * 100, 2)

    story.append(Paragraph(f"Student Report", styles['Title']))
    story.append(Paragraph(f"Name: {student_name}", styles['Normal']))
    story.append(Paragraph(f"Roll No.: {roll}", styles['Normal']))
    story.append(Paragraph(f"Attendance %: {percentage}% ", styles['Normal']))
    story.append(Spacer(1, 15))

    table_data = [["Date", "Time", "Status"]]
    for h in history:
        table_data.append([
            h["date"], h["time"], h["status"]
        ])

    table = Table(table_data)
    story.append(table)

    doc.build(story)
    return f"{student_id}.pdf"
