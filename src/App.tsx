import { getUsers } from "./api/users";

function App() {
  const users = getUsers(1);
  users.then((data) => console.log(data));
  return <>1</>;
}

export default App;
