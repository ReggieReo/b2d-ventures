"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {useDebouncedCallback} from "use-debounce";

export default function SortingSelect() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const handleSort = useDebouncedCallback((sortMethod: string) => {
        const params = new URLSearchParams(searchParams);
        if (sortMethod) {
            params.set("sortBy", sortMethod);
        } else {
            params.delete("sortBy");
        }
        router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleOrder = useDebouncedCallback((order: string) => {
        const params = new URLSearchParams(searchParams);
        if (order) {
            params.set("orderBy", order);
        } else {
            params.delete("orderBy");
        }
        router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className={"flex flex-row gap-x-2"}>
            <Select onValueChange={(e)=>{handleSort(e.valueOf())}}>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Sort By"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="created">Created</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="no_investor">Number of Investment</SelectItem>
                    {/*TODO: Enable after investment rework*/}
                    <SelectItem value="amount_invest" disabled={true}>Amount Invested</SelectItem>
                    <SelectItem value="remaining_stocks" disabled={true}>Remaining Stocks</SelectItem>
                    <SelectItem value="min_invest" disabled={true}>Minimum Investment</SelectItem>
                </SelectContent>
            </Select>
            <Select onValueChange={(e)=>{handleOrder(e.valueOf())}}>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Order"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}