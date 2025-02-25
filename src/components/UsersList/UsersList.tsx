import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { CircularProgress } from "@mui/material"; // Импортируем индикатор загрузки
import { deleteUsersRemote } from "../../api/users";
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
import { IUser } from "../../types";
import { useState } from "react";

interface UsersListProps {
  users: IUser[];
  currentUser: IUser | null;
  setCurrentUser: (obj: IUser | null) => void;
  toggleSidebar: (value: boolean) => void;
  isSidebarOpen: boolean;
  setUsers: (users: IUser[]) => void;
  snackBarOpen: boolean;
  setSnackBarOpen: (value: boolean) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  message: string;
  setMessage: (value: string) => void;
}

const UsersList = ({
  users,
  setUsers,
  currentUser,
  setCurrentUser,
  toggleSidebar,
  setSnackBarOpen,
  setMessage,
}: UsersListProps) => {
  const [sortBy, setSortBy] = useState<keyof IUser>("first_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null); // Состояние для отслеживания загрузки пользователя

  const sortUsers = (users: IUser[]) => {
    return [...users].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue === undefined || bValue === undefined) {
        return 0;
      }
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (field: keyof IUser) => {
    if (field === sortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const deleteUser = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation();
    setLoadingUserId(id); // Начинаем загрузку для этого пользователя
    let newUsers = users.filter((user) => user.id !== id);
    try {
      const response = await deleteUsersRemote(id);
      if (response.status === 204) {
        localStorage.setItem("users", JSON.stringify(newUsers));
        setSnackBarOpen(true);
        setMessage("Пользователь успешно удален");
        setUsers(newUsers);
        setCurrentUser(null);
      }
    } catch (error) {
      setSnackBarOpen(true);
      setMessage("Ошибка при удалении пользователя");
    } finally {
      setLoadingUserId(null); // Завершаем загрузку
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: { sm: "calc(100vh - 80px)", xs: "100vh" },
        backgroundColor: "#fff",
        margin: { sm: "40px", xs: 0 },
        padding: "30px",
        position: "relative",
        transition: "all 0.5s ease-in-out",
        borderRadius: { sm: "30px", xs: 0 },
        flexGrow: 1,
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
          <Button variant="outlined" onClick={() => toggleSidebar(true)}>
            Добавить
          </Button>
        </Box>
      )}

      {users.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: { sm: "calc(100vh - 200px)", xs: "calc(100vh - 100px)" },
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#e6e6e6" }}>
              <TableRow>
                <TableCell
                  sx={{
                    verticalAlign: "top",
                    fontWeight: 700,
                    textAlign: "center",
                    cursor: "default",
                  }}
                >
                  Аватар
                </TableCell>
                {["full_name", "email", "gender", "dob"].map((header, idx) => (
                  <TableCell
                    key={idx}
                    sx={{
                      verticalAlign: "top",
                      fontWeight: 700,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSort(header === "full_name" ? "first_name" : (header as keyof IUser))}
                  >
                    {header === "full_name" ? "Полное имя" : header === "dob" ? "Дата рождения" : header}
                    {sortBy === (header === "full_name" ? "first_name" : header) &&
                      (sortDirection === "asc" ? (
                        <ArrowDropUpIcon fontSize="small" sx={{ marginLeft: "5px" }} />
                      ) : (
                        <ArrowDropDownIcon fontSize="small" sx={{ marginLeft: "5px" }} />
                      ))}
                  </TableCell>
                ))}
                <TableCell sx={{ verticalAlign: "top", fontWeight: 700, textAlign: "center" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortUsers(users).map((user) => (
                <TableRow
                  key={user.id}
                  onClick={() => setCurrentUser(user)}
                  sx={{
                    backgroundColor: currentUser?.id === user.id ? "#619ab133" : "fff",
                    cursor: "pointer",
                  }}
                >
                  <TableCell>
                    <Avatar alt={user.first_name} src={user.avatar} />
                  </TableCell>
                  <TableCell>
                    {user.last_name} {user.first_name[0]}.
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.dob}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      sx={{ marginRight: "10px", marginBottom: "5px", width: "120px" }}
                      onClick={() => toggleSidebar(true)}
                    >
                      Изменить
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      sx={{ marginRight: "10px", width: "120px", position: "relative" }}
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        deleteUser(e, user.id);
                      }}
                    >
                      {loadingUserId === user.id ? (
                        <CircularProgress size={20} sx={{ position: "absolute", right: "10px" }} />
                      ) : (
                        "Удалить"
                      )}
                    </Button>
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
