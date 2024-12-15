import {
  Modal,
  Button,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Grid,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getUsers } from "../../api/users";
import { isAdult } from "../../utils/isAdult";

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

  useEffect(() => {
    const fetchUsersData = async () => {
      setLoading(true);
      try {
        const users = await getUsers(1);
        setUserList(users);
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
      }
      setLoading(false);
    };
    fetchUsersData();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const target = event.currentTarget;
    const bottom = target.scrollHeight === target.scrollTop + target.clientHeight;
    if (bottom && !loading) {
      console.log("Reached bottom of the list");
    }
  };

  const handleGenderChange = (event: React.ChangeEvent<{ value: string }>) => {
    const selectedGender = event.target.value;
    setGender(selectedGender);

    if (selectedGender === "Мужской" && role === "Медсестра") {
      setRole("Медбрат");
    } else if (selectedGender === "Женский" && role === "Медбрат") {
      setRole("Медсестра");
    }
  };

  const handleRoleChange = (event: React.ChangeEvent<{ value: string }>) => {
    const selectedRole = event.target.value;
    setRole(selectedRole);

    if (selectedRole === "Медсестра") {
      setGender("Женский");
    } else if (selectedRole === "Медбрат") {
      setGender("Мужской");
    }
  };

  const handleSubmit = () => {};
  const handleSearch = (event: React.ChangeEvent<{}>, value: string) => {
    setSearchTerm(value);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
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
        <h2>Форма</h2>
        <section>
          <h3>О себе</h3>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <Autocomplete
              disablePortal
              options={userList}
              getOptionLabel={(option) => `${option.last_name} ${option.first_name.charAt(0)}.`}
              onInputChange={handleSearch}
              renderInput={(params) => <TextField {...params} label="Пользователь" />}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={loading}
              noOptionsText="Нет пользователей"
              slotProps={{
                listbox: {
                  onScroll: handleScroll,
                  style: { maxHeight: 200, overflow: "auto" },
                },
              }}
            />
          </FormControl>

          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Пол" select value={gender} onChange={handleGenderChange}>
                <MenuItem value="Мужской">Мужской</MenuItem>
                <MenuItem value="Женский">Женский</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Роль" select value={role} onChange={handleRoleChange}>
                <MenuItem value="Медбрат">Медбрат</MenuItem>
                <MenuItem value="Медсестра">Медсестра</MenuItem>
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
                error={dob && !isAdult(dob) ? true : false}
                helperText={dob && !isAdult(dob) ? "Возраст должен быть не младше 18 лет" : ""}
                sx={{ input: { cursor: "pointer" } }}
              />
            </Grid>
          </Grid>
        </section>

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

        <section>
          <h3>Работа</h3>
          <TextField
            fullWidth
            label="Место работы"
            value={workplace}
            onChange={(e) => setWorkplace(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          {/* <TextField
            fullWidth
            label="Должностные обязанности"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            sx={{ marginBottom: 2 }}
          /> */}
          <TextField
            fullWidth
            label="Должностные обязанности"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            sx={{ marginBottom: 2 }}
            multiline
            rows={3} // Устанавливаем количество строк в textarea
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
