export function getSemesterPlan() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  let plan = '';
  if (month <= 4) {
    plan = 'Spring ' + year;
  } else {
    plan = 'Fall ' + year;
  }
  return plan;
}

export function getYearPlan() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  let plan = '';
  if (month <= 4) {
    plan = 'Spring and Fall ' + year;
  } else {
    plan = 'Fall ' + year + ' and Spring ' + (year + 1);
  }
  return plan;
}
