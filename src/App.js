import { useDispatch, useSelector } from "react-redux";
import { insert_user, log_in, set_role, set_user_shop } from "./redux/action";
import Routes from "./Routes/Routes";

const token = localStorage.getItem("access_token");
const emulated_role = localStorage.getItem("role");
const shop_detail = localStorage.getItem("shop_detail");

let user = {};
let shop = {};
if (token) {
  user = JSON.parse(localStorage.getItem("user"));
}
if (shop_detail) {
  shop = JSON.parse(localStorage.getItem("shop_detail"));
}

function App() {
  const dispatch = useDispatch();
  if (token) {
    dispatch(log_in());
    dispatch(insert_user(user));
    if (emulated_role) {
      dispatch(set_role(parseInt(emulated_role)));
    }
    if (shop_detail) {
      dispatch(set_user_shop(shop));
    }
  }
  const isAuthenticated = useSelector((state) => state.authenticated);
  return (
    <div className="App">
      <Routes isAuthenticated={isAuthenticated} />
    </div>
  );
}

export default App;
