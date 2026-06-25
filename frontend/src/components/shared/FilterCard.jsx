import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useDispatch } from 'react-redux'
import { setHomeSearchJobByText } from '../../store/jobSlice'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
    {
        filterType: "Job Type",
        array: ["Internship", "Full Time", "Part Time", "Remote"]
    },
 
]

const FilterCard = () => {
    // store one selected value per filter category
    const [selected, setSelected] = useState({
        location: "",
        industry: "",
        salary: "",
        jobType: "",
    });
    const dispatch = useDispatch();

    const handleChange = (key, value) => {
        setSelected((prev) => ({ ...prev, [key]: value }));
    };

    // compose combined keyword for backend's keyword search
    useEffect(() => {
        const parts = Object.values(selected).filter(Boolean);
        // join with '|' so backend RegExp treats tokens as alternation (matches any)
        const combined = parts.join("|");
        dispatch(setHomeSearchJobByText(combined));
    }, [selected, dispatch]);

    return (
        <div className=" bg-white p-3 rounded-md">
            <h1 className="font-bold text-lg">Filter Jobs</h1>
            <hr className="mt-3" />
            {filterData.map((group, index) => (
                <div key={group.filterType} className="mb-4">
                    <h1 className="font-bold text-lg">{group.filterType}</h1>
                    <RadioGroup value={selected[group.key]} onValueChange={(v) => handleChange(group.key, v)}>
                        {group.array.map((item, idx) => {
                            const itemId = `id${index}-${idx}`;
                            return (
                                <div className="flex items-center space-x-2 my-2" key={itemId}>
                                    <RadioGroupItem value={item} id={itemId} />
                                    <Label htmlFor={itemId}>{item}</Label>
                                </div>
                            );
                        })}
                    </RadioGroup>
                </div>
            ))}
        </div>
    );
};

export default FilterCard