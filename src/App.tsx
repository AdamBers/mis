import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import UsersList from "./components/UsersList/UsersList";
import UsersEditForm from "./components/UsersEditForm/UsersEditForm";
import ModalForm from "./components/ModalForm/ModalForm";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { IUser } from "./types";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  const toggleSidebar = (value: boolean) => {
    setSidebarOpen(value);
  };

  const toggleModal = (value: boolean) => {
    setModalOpen(value);
  };
  const handleCloseSnackBar = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    console.log(event);

    setSnackBarOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        maxWidth: "1440px",
        margin: "0 auto",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
      }}
    >
      <Snackbar
        open={snackBarOpen}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message={message}
        onClose={handleCloseSnackBar}
        autoHideDuration={5000}
      ></Snackbar>
      <UsersEditForm
        users={users}
        setUsers={setUsers}
        isModalOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        toggleModal={toggleModal}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        snackBarOpen={snackBarOpen}
        setSnackBarOpen={setSnackBarOpen}
        loading={loading}
        setLoading={setLoading}
        setMessage={setMessage}
        message={message}
      />
      <UsersList
        users={users}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setUsers={setUsers}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        snackBarOpen={snackBarOpen}
        setSnackBarOpen={setSnackBarOpen}
        loading={loading}
        setLoading={setLoading}
        setMessage={setMessage}
        message={message}
      />
      <ModalForm
        open={isModalOpen}
        toggleModal={toggleModal}
        users={users}
        setUsers={setUsers}
        setCurrentUser={setCurrentUser}
        setSnackBarOpen={setSnackBarOpen}
        setMessage={setMessage}
      />
    </Box>
  );
}

export default App;
