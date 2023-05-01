
import { useRoutes } from "react-router-dom";
import Routes from "./routes/router";







function App() {
  const routing = useRoutes(Routes);

  return (
    <>
      <div className="App">{routing} </div>
    </>
  )



}

export default App;
