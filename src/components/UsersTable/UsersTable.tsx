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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUsers } from "../../api/users"; // Импортируем функцию для получения пользователей
import { IUserResponse } from "../../types/user";

interface UsersTableProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UsersTable = ({ setOpen }: UsersTableProps) => {
  const [users, setUsers] = useState<IUserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers(); // Получаем пользователей
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Ошибка при загрузке пользователей", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }
  if (!users) {
    return <p>Нет пользователей</p>;
  }

  return (
    <>
      <h3>Список пользователей</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Аватар</TableCell>
              <TableCell>Полное имя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Пол</TableCell>
              <TableCell>Дата рождения</TableCell>
              <TableCell></TableCell>
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
                <TableCell>Не указано</TableCell> <TableCell>Не указано</TableCell>{" "}
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon sx={{ marginRight: 0 }} />}
                    sx={{ marginRight: "10px" }}
                    onClick={() => setOpen(true)}
                  ></Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ marginRight: "10px" }}
                    startIcon={<DeleteIcon sx={{ marginRight: 0 }} />}
                  ></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UsersTable;
