import json

from fpdf import FPDF

#declare file, variable name f
with open('api/resumeContents.json') as f:
    #loads the data in json format
    data = json.load(f)
    
# pdf = FPDF()
# pdf.add_page()
# pdf.set_font('Times', 'BI', 12)
# pdf.cell(200, 4, data['fullName'], 0, 2, 'C', False)
# pdf.set_font('Times', '', 11)
# pdf.cell(200, 4, data['email'] + ' | ' + data['phoneNumber'] + ' | ' + data['github'], 0, 2, 'C', False)
# pdf.set_font('Times', 'B', 11)
# pdf.cell(200, 4, 'Education', 0, 2, 'L', False)
# pdf.line(11, 21.5, 200, 21.5)
# pdf.cell(100, 3, data['university'], 0, 1, 'L', False)
# pdf.cell(200, 0, data['graduationDate'], 0, 2, 'R', False)
# pdf.set_font('Times', 'I', 10)
# pdf.cell(200, 4, data['majorAndSchool'], 0, 2, 'L', False)
# pdf.output('tuto2.pdf', 'F')