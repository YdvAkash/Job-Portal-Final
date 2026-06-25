import React, { useEffect, useState } from "react";
import { JOB_API_END_POINT } from "../utils/const.js";
import axios from "axios";
import { setAllJobs, setJobError } from "../store/jobSlice.js";
import { useDispatch, useSelector } from "react-redux";

function useGetAllJobs() {
  const { homeSearchJobByText } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Add a small delay to allow for state updates from navigation
    const timer = setTimeout(async () => {
      const fetchAllJobs = async () => {
        setIsLoading(true);
        try {
          // Debug: log the search token and params
          console.log("useGetAllJobs: homeSearchJobByText=", homeSearchJobByText);
          // Default to first page with modest limit to keep payload small
          const params = homeSearchJobByText
            ? { keyword: homeSearchJobByText, page: 1, limit: 20 }
            : { page: 1, limit: 20 };
          console.log("useGetAllJobs: requesting", `${JOB_API_END_POINT}/all`, params);

          // Make the request WITHOUT withCredentials for public endpoints
          const res = await axios.get(`${JOB_API_END_POINT}/all`, { params });

          if (res.data.success) {
            dispatch(setAllJobs(res.data.jobs));
            dispatch(setJobError(null));
          }
        } catch (error) {
          console.log("Error fetching jobs:", error);
          
          // Check if it's a 404 error (no jobs found)
          if (error.response && error.response.status === 404) {
            dispatch(setAllJobs([]));
            dispatch(setJobError("No jobs match your search criteria."));
          } else {
            dispatch(setAllJobs([]));
            dispatch(setJobError("Failed to fetch jobs. Please try again."));
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchAllJobs();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [dispatch, homeSearchJobByText]);

  return { isLoading };
}

export default useGetAllJobs;
