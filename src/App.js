import { useDispatch, useSelector } from "react-redux";
import { insert_user, log_in } from "./redux/action";
import Routes from "./Routes/Routes";

const token = localStorage.getItem("access_token");
let user = {};
if (token) {
  user = JSON.parse(localStorage.getItem("user"));
}

function App() {
  const dispatch = useDispatch();
  if (token) {
    dispatch(log_in());
    dispatch(insert_user(user));
  }
  const isAuthenticated = useSelector((state) => state.authenticated);
  return (
    <div className="App">
      <Routes isAuthenticated={isAuthenticated} />
    </div>
  );
}

export default App;
