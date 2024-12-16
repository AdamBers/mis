import { useState } from "react";
import UsersTable from "./components/UsersTable/UsersTable";
import UsersForm from "./components/UsersForm/UsersForm";

function App() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  return (
    <>
      <UsersForm open={modalOpen} setOpen={setModalOpen} />
      <UsersTable setOpen={setModalOpen} />
    </>
  );
}

export default App;
