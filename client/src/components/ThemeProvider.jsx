import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  /*  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]    dark:from-[#065179]      dark:to-[#0e1425]*/
  return (
    <div className={theme}>
      <div
        className="  flex  min-h-screen w-full flex-col justify-stretch
         bg-white 
        
                      text-gray-950
                dark:bg-[radial-gradient(ellipse_at_top,_hsl(206,95%,20%)_0%,_hsl(224,45%,5%)_100%)]
                     dark:text-white "
      >
        {children}
      </div>
    </div>
  );
}
//relative
// bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 text-gray-950
//dark:bg-dark-main-bg

//from-sky-50  to-blue-100
//dark:from-sky-800 dark:to-dark-main-bg
//dark:from-sky-900  #0d4a72
//dark:from-sky-800 dark:to-[#0e1425]
//bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
//dark:from-[#065179] dark:to-[#0e1425]

//backgroundImage: {  "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",},

//   bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
//  from-purple-800           to-blue-900    dark:from-[#054161]

//from-sky-200    to-blue-600
// from-sky-50 to-blue-300
