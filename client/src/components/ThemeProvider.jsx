import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div
        className="min-h-screen  bg-white
        bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
         text-gray-950
         dark:from-[#065179] dark:to-[#0e1425] dark:text-white"
      >
        {children}
      </div>
    </div>
  );
}

// bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 text-gray-950
//dark:bg-dark-main-bg

//from-sky-50  to-blue-100
//dark:from-sky-800 dark:to-dark-main-bg
//dark:from-sky-900  #0d4a72
//dark:from-sky-800 dark:to-[#0e1425]
