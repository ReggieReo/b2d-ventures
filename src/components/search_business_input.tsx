"use client";
import { Input } from "~/components/ui/input";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function SearchBusinessInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
      <Input
          className="mt-4"
          placeholder="Search businesses"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('query') ?? ""}
      />
  );
}
