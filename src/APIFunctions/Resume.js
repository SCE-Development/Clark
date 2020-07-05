import axios from "axios";
import { ApiResponse } from "./ApiResponses";

export async function getResume(newResume) {
  let status = new ApiResponse();
  const resumeToAdd = {
    name: newResume.name,
    phone: newResume.phone,
    email: newResume.email,
    github: newResume.github,
    educationPart: newResume.educationPart,
    education: newResume.education,
  };
  console.log(resumeToAdd.github);
  await axios.post("api/resume/ResumeForm").catch(() => {
    status.error = true;
  });

  return status;
}
