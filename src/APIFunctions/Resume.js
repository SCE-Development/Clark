import axios from "axios";
import { ApiResponse } from "./ApiResponses";

export async function getResume(newResume) {
  let status = new ApiResponse();
  const resumeToAdd = {
    name: newResume.name,
    phone: newResume.phone,
    email: newResume.email,
    github: newResume.github,
    schoolName: newResume.schoolName,
    gradYear: newResume.gradYear,
    titleMajor: newResume.titleMajor,
    college: newResume.college,
    GPA: newResume.GPA,
    relevantCoursework: newResume.relevantCoursework,
    skillsProficient: newResume.skillsProficient,
    skillsExperienced: newResume.skillsExperienced,
    skillsFamiliar: newResume.skillsFamiliar,
  };
  await axios.post("api/Resume/ResumeForm", {resumeToAdd}).catch(() => {
    status.error = true;
  });
  return status;
}
