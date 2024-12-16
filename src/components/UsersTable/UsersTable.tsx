// UsersTable.tsx
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Avatar,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUsers } from "../../api/users";
import { IUserResponse } from "../../types/user";

interface UsersTableProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UsersTable = ({ setOpen }: UsersTableProps) => {
  const [users, setUsers] = useState<IUserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers.data);
      } catch (error) {
        console.error("Ошибка при загрузке пользователей", error);
        setError("Не удалось загрузить пользователей.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Список пользователей
      </Typography>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Аватар</TableCell>
                <TableCell>Полное имя</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Пол</TableCell>
                <TableCell>Дата рождения</TableCell>
                <TableCell align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
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
                      onClick={() => setOpen(true)}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      sx={{ marginRight: "10px" }}
                      onClick={() => {}}
                    >
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {error && (
        <Typography variant="body1" color="error" align="center" style={{ marginTop: "20px" }}>
          {error}
        </Typography>
      )}
    </>
  );
};

export default UsersTable;
