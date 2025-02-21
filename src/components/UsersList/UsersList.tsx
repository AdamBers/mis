import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import { IUser, ModalProps } from "../../types";

interface UsersListProps extends ModalProps {
  users: IUser[];
  currentUserId: null | number;
  setCurrentUserId: (value: number) => void;
  deleteUser: (id: number) => void;
}

const UsersList = ({
  isModalOpen,
  handleModal,
  users,
  currentUserId,
  setCurrentUserId,
  deleteUser,
}: UsersListProps) => {
  return (
    <Box
      sx={{
        width: "700px",
        backgroundColor: "#fff",
        margin: "40px",
        padding: "30px",
        position: "relative",
        right: 0,
        transform: isModalOpen ? "translateX(0)" : "translateX(-80%)",
        transition: "all 0.5s ease-in-out",
        borderRadius: "30px",
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ textAlign: "center", marginBottom: 5 }}>
        Список пользователей
      </Typography>

      {users.length === 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
            Список пуст
          </Typography>
          <Button variant="outlined" onClick={() => handleModal(true)}>
            Добавить
          </Button>
        </Box>
      )}

      {users.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Аватар</TableCell>
                <TableCell>Полное имя</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Пол</TableCell>
                <TableCell>Дата рождения</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  onClick={() => setCurrentUserId(user.id)}
                  sx={{ backgroundColor: currentUserId === user.id ? "#619ab133" : "fff", cursor: "pointer" }}
                >
                  <TableCell>
                    <Avatar alt={user.first_name} src={user.avatar} />
                  </TableCell>
                  <TableCell>{`${user.last_name} ${user.first_name[0]}.`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>Не указано</TableCell>
                  <TableCell>Не указано</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      sx={{ marginRight: "10px" }}
                      onClick={() => handleModal(true)}
                    ></Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      sx={{ marginRight: "10px" }}
                      onClick={() => deleteUser(user.id)}
                    ></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UsersList;
