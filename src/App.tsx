import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import UsersList from "./components/UsersList/UsersList";
import UsersForm from "./components/UsersForm/UsersForm";
import { IUser } from "./types";
import ModalForm from "./components/ModalForm/ModalForm";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  const addUser = (user: IUser) => {
    const updatedUsers = [...users, user];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const deleteUser = (id: number) => {
    if (id) {
      let newUsers = users.filter((user) => user.id !== id);
      localStorage.setItem("users", JSON.stringify(newUsers));
      setUsers(newUsers);
    }
  };

  const updateUsers = (user: IUser) => {
    if (currentUserId !== null) {
      const updatedUsers = users.map((existingUser) => (existingUser.id === currentUserId ? user : existingUser));
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }
  };

  const handleSidebar = (value: boolean) => {
    setSidebarOpen(value);
  };
  const handleModal = (value: boolean) => {
    setModalOpen(value);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
      }}
    >
      <UsersForm
        users={users}
        setUsers={setUsers}
        isModalOpen={isSidebarOpen}
        handleSidebar={handleSidebar}
        addUser={addUser}
        handleModal={handleModal}
        currentUserId={currentUserId}
        updateUsers={updateUsers}
        setCurrentUserId={setCurrentUserId}
      />
      <UsersList
        isModalOpen={isSidebarOpen}
        handleModal={handleSidebar}
        users={users}
        currentUserId={currentUserId}
        setCurrentUserId={setCurrentUserId}
        deleteUser={deleteUser}
      />
      <ModalForm open={isModalOpen} handleModal={handleModal} addUser={addUser} />
    </Box>
  );
}

export default App;
