import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="min-h-screen  bg-white text-gray-900 dark:bg-[rgb(16,23,42)] dark:text-white">
        {children}
      </div>
    </div>
  );
}
