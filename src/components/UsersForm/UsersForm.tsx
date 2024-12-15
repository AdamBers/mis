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
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

interface UsersFormProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UsersForm = ({ open, setOpen }: UsersFormProps) => {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [dob, setDob] = useState("");
  const [university, setUniversity] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const fetchUsers = async (search) => {
    setLoading(true);

    setLoading(false);
  };

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value;
    setGender(selectedGender);

    if (selectedGender === "Мужской" && role === "Медсестра") {
      setRole("Медбрат");
    } else if (selectedGender === "Женский" && role === "Медбрат") {
      setRole("Медсестра");
    }
  };

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setRole(selectedRole);

    if (selectedRole === "Медсестра") {
      setGender("Женский");
    } else if (selectedRole === "Медбрат") {
      setGender("Мужской");
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
      <Box
        sx={{
          backgroundColor: "#fff",
          maxWidth: "768px",
          margin: "auto",
          padding: 3,
          borderRadius: 3,
          marginTop: 2,
        }}
      >
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

          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            {/* Пол и Роль */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Пол" select value={gender} onChange={handleGenderChange}>
                <MenuItem value="Мужской">Мужской</MenuItem>
                <MenuItem value="Женский">Женский</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Роль" select value={role} onChange={handleRoleChange}>
                {gender !== "Женский" && <MenuItem value="Медбрат">Медбрат</MenuItem>}
                {gender !== "Мужской" && <MenuItem value="Медсестра">Медсестра</MenuItem>}
                <MenuItem value="Доктор">Доктор</MenuItem>
                <MenuItem value="Админ">Админ</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Дата рождения"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                InputLabelProps={{ shrink: true }}
                error={dob && !isAdult(dob)}
                helperText={dob && !isAdult(dob) ? "Возраст должен быть не младше 18 лет" : ""}
                sx={{ input: { cursor: "pointer" } }}
              />
            </Grid>
          </Grid>
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

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ marginBottom: 2, width: "max-content", display: "block", marginLeft: "auto", marginRight: "auto" }}
        >
          Добавить/Сохранить
        </Button>

        {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
      </Box>
    </Modal>
  );
};

export default UsersForm;
