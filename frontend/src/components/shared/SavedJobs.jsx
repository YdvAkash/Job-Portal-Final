import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { JOB_API_END_POINT } from '../../utils/const';
import Job from './Job';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
          withCredentials: true
        });
        if (res.data.success) {
          setSavedJobs(res.data.savedJobs);
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, []);

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading saved jobs...</div>;
  }

  if (savedJobs.length === 0) {
    return (
      <div className="py-8 text-center">
        <h3 className="text-gray-500 mb-2">No saved jobs yet</h3>
        <p className="text-sm text-gray-400">Bookmark jobs you are interested in to see them here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {savedJobs.map((job) => (
        <Job key={job._id} job={job} />
      ))}
    </div>
  );
};

export default SavedJobs;
