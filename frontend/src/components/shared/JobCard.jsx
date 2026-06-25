import React from "react";
import Job from "./Job";

function JobCard({ job, index }) {
  return <Job job={job} index={index} />;
}

export default JobCard;