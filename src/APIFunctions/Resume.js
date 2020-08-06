import axios from "axios";
import { ApiResponse } from "./ApiResponses";

export async function getResume(newResume) {
  let status = new ApiResponse();
  const resumeToAdd = {
    personal: {
      fullName: newResume.name,
      email: newResume.email,
      phoneNumber: newResume.phone,
      github: newResume.github
    },
    education:{
      university: newResume.schoolName,
      graduationDate: newResume.gradYear,
      titleMajor: newResume.titleMajor,
      college: newResume.college,
      cumulativeGPA: newResume.GPA,
      courseWork: newResume.relevantCoursework,
    },
  
    experienceList: newResume.experienceInfo,
    projectList: newResume.projectInfo,
      skills:{
      proficient: newResume.skillsProficient,
      experienced: newResume.skillsExperienced,
      familiar: newResume.skillsFamiliar,
    },
  };
  
  await axios.post("api/Resume/ResumeForm", {resumeToAdd}).catch(() => {
    status.error = true;
  });
  return status;
}
