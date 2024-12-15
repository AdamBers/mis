import {
  Modal,
  Button,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const UsersForm = ({ open, setOpen }) => {
  const [userList, setUserList] = useState([]); // Список пользователей
  const [searchTerm, setSearchTerm] = useState(""); // Для поиска
  const [gender, setGender] = useState(""); // Пол
  const [role, setRole] = useState(""); // Роль
  const [dob, setDob] = useState(""); // Дата рождения
  const [university, setUniversity] = useState(""); // ВУЗ
  const [graduationYear, setGraduationYear] = useState(""); // Год окончания
  const [workplace, setWorkplace] = useState(""); // Место работы
  const [jobDescription, setJobDescription] = useState(""); // Должностные обязанности
  const [loading, setLoading] = useState(false); // Лоадер для загрузки списка

  const handleClose = () => {
    setOpen(false);
  };

  // Метод для получения пользователей по запросу
  const fetchUsers = async (search) => {
    setLoading(true);
    // Логика запроса пользователей
    setLoading(false);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
    if (event.target.value === "Мужской") {
      setRole("Медбрат");
    } else if (event.target.value === "Женский") {
      setRole("Медсестра");
    }
  };

  const handleSubmit = () => {
    // Логика отправки данных
  };

  const isAdult = (dob) => {
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    return age >= 18;
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ backgroundColor: "#fff", width: "60vw", minHeight: "60vh", margin: "auto", padding: 2 }}>
        <IconButton onClick={handleClose} sx={{ position: "absolute", right: 10, top: 10 }}>
          <CloseIcon />
        </IconButton>

        <h2>Форма создания/редактирования пользователя</h2>

        {/* О себе */}
        <section>
          <h3>О себе</h3>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Пользователь</InputLabel>
            <Select
              label="Пользователь"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={() => fetchUsers(searchTerm)}
              MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
            >
              {userList.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.last_name} {user.first_name.charAt(0)}.
                </MenuItem>
              ))}
              {searchTerm && !userList.find((user) => user.last_name === searchTerm) && (
                <MenuItem value="addNew">Добавить нового пользователя</MenuItem>
              )}
            </Select>
          </FormControl>

          <TextField fullWidth label="Пол" select value={gender} onChange={handleGenderChange} sx={{ marginBottom: 2 }}>
            <MenuItem value="Мужской">Мужской</MenuItem>
            <MenuItem value="Женский">Женский</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Роль"
            select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ marginBottom: 2 }}
          >
            {gender && gender === "Мужской" && <MenuItem value="Медбрат">Медбрат</MenuItem>}
            {gender && gender === "Женский" && <MenuItem value="Медсестра">Медсестра</MenuItem>}
            {!gender && (
              <>
                <MenuItem value="Доктор">Доктор</MenuItem>
                <MenuItem value="Медсестра">Медсестра</MenuItem>
                <MenuItem value="Медбрат">Медбрат</MenuItem>
              </>
            )}
            <MenuItem value="Админ">Админ</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Дата рождения"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
            error={dob && !isAdult(dob)}
            helperText={dob && !isAdult(dob) ? "Возраст должен быть не младше 18 лет" : ""}
          />
        </section>

        {/* Образование */}
        <section>
          <h3>Образование</h3>
          <TextField
            fullWidth
            label="ВУЗ"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Год окончания"
            type="number"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
        </section>

        {/* Работа */}
        <section>
          <h3>Работа</h3>
          <TextField
            fullWidth
            label="Место работы"
            value={workplace}
            onChange={(e) => setWorkplace(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Должностные обязанности"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
        </section>

        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth sx={{ marginBottom: 2 }}>
          Добавить/Сохранить
        </Button>

        {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
      </Box>
    </Modal>
  );
};

export default UsersForm;
