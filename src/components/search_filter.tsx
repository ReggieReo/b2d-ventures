"use client";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { industries } from "~/utils/enum/industryList";
import { Checkbox } from "~/components/ui/checkbox";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {ScrollArea} from "~/components/ui/scroll-area";
import {useDebouncedCallback} from "use-debounce";

export default function SearchBusinessFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const [checkedIndustries, setCheckedIndustries] = useState<Record<string, boolean>>({});

    const handleCheckedChange = (label: string, checked: boolean) => {
        setCheckedIndustries((prev) => ({
            ...prev,
            [label]: checked,
        }));
    };

    const getCheckedIndustries = () => {
        return Object.keys(checkedIndustries).filter((key) => checkedIndustries[key]);
    };

    const handleFilter = useDebouncedCallback(() => {
        const selectedIndustries = getCheckedIndustries();
        const params = new URLSearchParams(searchParams.toString());

        if (selectedIndustries.length > 0) {
            params.set("industry", selectedIndustries.join(","));
        } else {
            params.delete("industry");
        }

        router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button>Filter</Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="gap-4">
                    <p className="font-bold">Select Industry</p>
                    <ScrollArea className="h-[200px] w-full">
                    {industries.map((industry) => (
                        <div key={industry.label} className="flex items-center gap-2">
                            <Checkbox
                                id={industry.label}
                                checked={checkedIndustries[industry.value]}
                                onCheckedChange={(checked: boolean) =>
                                    handleCheckedChange(industry.value, checked)
                                }
                            />
                            <label htmlFor={industry.label}>{industry.label}</label>
                        </div>
                    ))}
                    </ScrollArea>
                </div>
                <div className="mt-4">
                    <Button onClick={handleFilter}>Apply Filter</Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
