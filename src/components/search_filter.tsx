"use client";
import { useState } from "react";
import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/popover";
import {Button} from "~/components/ui/button";
import {industries} from "~/utils/enum/industryList";
import {Checkbox} from "~/components/ui/checkbox";

export default function SearchBusinessFilter() {
    const [checkedIndustries, setCheckedIndustries] = useState(
        industries.reduce((acc, industry) => ({ ...acc, [industry.label]: false }), {})
    );

    const handleCheckedChange = (label: string, checked: boolean) => {
        setCheckedIndustries((prev) => ({
            ...prev,
            [label]: checked,
        }));
        console.log(label, checked);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button>Filter</Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="gap-4">
                    <p className={"font-bold"}>Select Industry</p>
                    {industries.map((industry) => (
                        <div key={industry.label} className="flex items-center gap-2">
                            <Checkbox
                                id={industry.label}
                                checked={checkedIndustries[industry.label]}
                                onCheckedChange={(checked) => handleCheckedChange(industry.label, checked)}
                            />
                            <label htmlFor={industry.label}>{industry.label}</label>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}