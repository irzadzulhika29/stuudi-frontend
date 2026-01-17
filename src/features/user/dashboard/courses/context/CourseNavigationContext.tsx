"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

export interface CourseNavItem {
  label: string;
  href: string;
  isCompleted?: boolean;
}

export interface CourseNavigationState {
  courseId?: string;
  courseName?: string;
  topicId?: string;
  topicName?: string;
  materiId?: string;
  materiName?: string;
  subItems: CourseNavItem[];
}

interface CourseNavigationContextType {
  navigation: CourseNavigationState;
  setCourseNav: (course: { id: string; name: string }) => void;
  setTopicNav: (
    course: { id: string; name: string },
    topic: { id: string; name: string }
  ) => void;
  setMateriNav: (
    course: { id: string; name: string },
    topic: { id: string; name: string },
    materi: { id: string; name: string }
  ) => void;
  clearNav: () => void;
}

const initialState: CourseNavigationState = {
  subItems: [],
};

const CourseNavigationContext = createContext<
  CourseNavigationContextType | undefined
>(undefined);

export function CourseNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [navigation, setNavigation] =
    useState<CourseNavigationState>(initialState);

  const setCourseNav = useCallback((course: { id: string; name: string }) => {
    setNavigation({
      courseId: course.id,
      courseName: course.name,
      subItems: [
        {
          label: course.name,
          href: `/courses/${course.id}`,
        },
      ],
    });
  }, []);

  const setTopicNav = useCallback(
    (
      course: { id: string; name: string },
      topic: { id: string; name: string }
    ) => {
      setNavigation({
        courseId: course.id,
        courseName: course.name,
        topicId: topic.id,
        topicName: topic.name,
        subItems: [
          {
            label: course.name,
            href: `/courses/${course.id}`,
          },
          {
            label: topic.name,
            href: `/courses/${course.id}/topic/${topic.id}`,
          },
        ],
      });
    },
    []
  );

  const setMateriNav = useCallback(
    (
      course: { id: string; name: string },
      topic: { id: string; name: string },
      materi: { id: string; name: string }
    ) => {
      setNavigation({
        courseId: course.id,
        courseName: course.name,
        topicId: topic.id,
        topicName: topic.name,
        materiId: materi.id,
        materiName: materi.name,
        subItems: [
          {
            label: course.name,
            href: `/courses/${course.id}`,
          },
          {
            label: topic.name,
            href: `/courses/${course.id}/topic/${topic.id}`,
          },
          {
            label: materi.name,
            href: `/courses/${course.id}/topic/${topic.id}/materi/${materi.id}`,
          },
        ],
      });
    },
    []
  );

  const clearNav = useCallback(() => {
    setNavigation(initialState);
  }, []);

  return (
    <CourseNavigationContext.Provider
      value={{ navigation, setCourseNav, setTopicNav, setMateriNav, clearNav }}
    >
      {children}
    </CourseNavigationContext.Provider>
  );
}

export function useCourseNavigation() {
  const context = useContext(CourseNavigationContext);
  if (!context) {
    throw new Error(
      "useCourseNavigation must be used within CourseNavigationProvider"
    );
  }
  return context;
}
