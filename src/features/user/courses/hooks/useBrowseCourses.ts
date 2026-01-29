import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { courseService } from "../services/courseService";
import { BrowseCoursesRequest } from "../types/courseTypes";

interface UseBrowseCoursesOptions extends Partial<BrowseCoursesRequest> {
  enabled?: boolean;
}

export const useBrowseCourses = (initialParams?: UseBrowseCoursesOptions) => {
  const [page, setPage] = useState(initialParams?.page || 1);
  const [perPage, setPerPage] = useState(initialParams?.per_page || 10);
  const [search, setSearch] = useState(initialParams?.search || "");

  const debouncedSearch = useDebounce(search, 500);

  const query = useQuery({
    queryKey: ["browse-courses", page, perPage, debouncedSearch],
    queryFn: () =>
      courseService.browseCourses({
        page,
        per_page: perPage,
        search: debouncedSearch,
      }),
    placeholderData: (previousData) => previousData,
    enabled: initialParams?.enabled !== undefined ? initialParams.enabled : true,
  });

  return {
    ...query,
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
  };
};
