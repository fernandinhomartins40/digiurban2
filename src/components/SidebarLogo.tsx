
import { FC } from "react";

export const SidebarLogo: FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <svg
        className="w-8 h-8 text-blue-600 dark:text-blue-400"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 9L12 4L21 9L12 14L3 9Z"
          fill="currentColor"
        ></path>
      </svg>
      <h1 className="text-xl font-bold text-gray-800 dark:text-white font-title">
        DigiUrbis
      </h1>
    </div>
  );
};
