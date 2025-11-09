import React, { useContext, useEffect } from "react";
import { LinearProgress } from "@mui/material";
import AuthContext from "./context/auth/AuthContext";
import ModeContext from "./context/mode/ModeContext";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
// import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { logBackendStatus } from "./utils/checkBackend";

const AuthApp = React.lazy(() => import("./routes/authapp/AuthApp"));
const UnauthApp = React.lazy(() => import("./routes/unauthapp/UnAuthApp"));

function App() {
  //Call Auth context & Extract loading & isAuthenticated
  const { loading, isAuthenticated } = useContext(AuthContext);

  //Initializing the use Context to get DarkMode state
  const { darkMode } = useContext(ModeContext);

  //Get User Default Mode & Change Mode
  // const OSMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
 
  const darkTheme = createTheme(themeSettings(darkMode));

  // Check backend connectivity on app startup (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      logBackendStatus();
    }
  }, []);
  // useEffect(() => {
  //   OSMode ? dispatch({ type: "DARK" }) : dispatch({ type: "LIGHT" });
  //   //eslint-disable-next-line
  // }, [OSMode]);

  // let loading = false;
  if (loading) return <LinearProgress className="[&>*]:!bg-[#7451f8]" />;
  return (
    <React.Suspense fallback={<LinearProgress className="[&>*]:!bg-[#7451f8]" />}>
       <ThemeProvider theme={darkTheme}>
          <CssBaseline />
            {isAuthenticated ? (
              <AuthApp mode={darkMode} />
            ) : (
              <UnauthApp mode={darkMode} />
            )}
       </ThemeProvider>
        
    </React.Suspense>
  );
}

export default App;
