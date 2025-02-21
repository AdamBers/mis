import { Box, Button, TextField, MenuItem, FormControl, Grid, Autocomplete, Typography } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { getUsers, IUser, GetUsersResponse } from "../../api/users";
import { isAdult } from "../../utils/isAdult";
import { FormValues, ModalProps } from "../../types";

interface UsersFormProps extends ModalProps {
  addUser: (user: IUser) => void;
  handleSidebar: (value: boolean) => void;
  handleModal: (value: boolean) => void;
  users: IUser[];
  setUsers: (users: IUser[]) => void;
  currentUserId: number | null;
  setCurrentUserId: (id: number | null) => void;
  updateUsers: (obj: IUser) => void;
}

const UsersForm = ({
  users,
  setUsers,
  isModalOpen,
  handleSidebar,
  addUser,
  handleModal,
  currentUserId,
  setCurrentUserId,
  updateUsers,
}: UsersFormProps) => {
  let currentUser = users.find((user) => user.id === currentUserId);

  const {
    control,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      user: null,
      gender: "",
      role: "",
      dob: "",
      university: "",
      graduationYear: "",
      workplace: "",
      jobDescription: "",
    },
  });

  const [userList, setUserList] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const isFetching = useRef(false);
  const [showAddButton, setShowAddButton] = useState(false);

  const fetchUsersData = async (pageNumber: number) => {
    if (isFetching.current) {
      console.log(`Запрос для страницы ${pageNumber} уже выполняется.`);
      return;
    }
    isFetching.current = true;
    setLoading(true);
    setError(null);
    console.log(`Запрос данных для страницы ${pageNumber}`);
    try {
      const response: GetUsersResponse = await getUsers(pageNumber);
      console.log(`Получено ${response.data.length} пользователей с страницы ${pageNumber}`);
      setUserList((prevUsers) => [...prevUsers, ...response.data]);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
      setError("Не удалось загрузить пользователей. Пожалуйста, попробуйте позже.");
    }
    setLoading(false);
    isFetching.current = false;
  };

  const onSubmit = (data: FormValues) => {
    // Удаляем поле `user` из данных
    const { user, ...userData } = data;

    console.log(currentUserId);
    if (currentUserId !== null) {
      // Обновляем существующего пользователя
      const updatedUsers = users.map((user) => {
        return user.id === currentUserId ? { ...user, ...userData } : user;
      });
      console.log(users);

      console.log(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    } else {
      // Добавляем нового пользователя
      const newUser = { ...userData, id: Date.now() }; // Генерируем уникальный ID
      const updatedUsers = [...users, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setCurrentUserId(newUser.id); // Устанавливаем currentUserId для нового пользователя
    }
  };

  useEffect(() => {
    setUserList([]);
    setPage(1);
    setTotalPages(1);
    fetchUsersData(1);
    reset();
  }, [isModalOpen, reset]);

  useEffect(() => {
    if (currentUser) {
      reset({
        user: currentUser,
        gender: currentUser.gender || "",
        role: currentUser.role || "",
        dob: currentUser.dob || " ",
        university: currentUser.university || "",
        graduationYear: currentUser.graduationYear || "",
        workplace: currentUser.workplace || "",
        jobDescription: currentUser.jobDescription || "",
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        email: currentUser.email || "",
        avatar: currentUser.avatar || "",
      });
    }
  }, [currentUserId, users, reset]);

  useEffect(() => {
    const isUserFound = userList.some((user) => user.id === watch("user")?.id);
    setShowAddButton(!isUserFound);
  }, [userList, watch("user")]);

  useEffect(() => {
    if (page > 1) {
      fetchUsersData(page);
    }
  }, [page]);

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const target = event.currentTarget;
    const bottom = target.scrollHeight === target.scrollTop + target.clientHeight;

    if (bottom && !loading && page < totalPages) {
      console.log("Достигнут конец списка. Загрузка следующей страницы.");
      setPage((prevPage) => prevPage + 1);
    }
  };

  const selectedRole = watch("role");

  const handleGenderChange = (value: string) => {
    setValue("gender", value, { shouldValidate: true });
    if (value === "Мужской" && selectedRole === "Медсестра") {
      setValue("role", "Медбрат", { shouldValidate: true });
    } else if (value === "Женский" && selectedRole === "Медбрат") {
      setValue("role", "Медсестра", { shouldValidate: true });
    }
  };

  const handleRoleChange = (value: string) => {
    setValue("role", value, { shouldValidate: true });
    if (value === "Медсестра") {
      setValue("gender", "Женский", { shouldValidate: true });
    } else if (value === "Медбрат") {
      setValue("gender", "Мужской", { shouldValidate: true });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "100%",
        backgroundColor: "#fff",
        maxWidth: "768px",
        overflowY: "auto",
        flexShrink: 0,
        boxSizing: "border-box",
        position: "relative",
        transform: isModalOpen ? "translateX(0)" : "translateX(calc(-100% - 40px))",
        transition: "all 0.4s ease-in-out",
        padding: "30px 45px",
        borderRadius: "30px",
        margin: "40px",
      }}
    >
      <CloseOutlinedIcon
        onClick={() => handleSidebar(false)}
        sx={{
          position: "absolute",
          right: "30px",
          top: "30px",
          color: "warning",
          cursor: "pointer",
          "&:hover": {
            color: "primary.main",
          },
        }}
      />

      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontSize: "36px",
          marginBottom: "27px",
        }}
      >
        Редактирование
      </Typography>
      <section>
        <h3>О себе</h3>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <Controller
            name="user"
            control={control}
            rules={{ required: "Пользователь обязателен" }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={userList}
                getOptionLabel={(option) => `${option.last_name} ${option.first_name.charAt(0)}. (${option.id})`}
                onChange={(_, selectedUser) => {
                  field.onChange(selectedUser);
                  if (selectedUser) {
                    // reset({
                    //   user: selectedUser,
                    //   first_name: selectedUser.first_name || "",
                    //   last_name: selectedUser.last_name || "",
                    //   email: selectedUser.email || "",
                    //   avatar: selectedUser.avatar || "",
                    //   gender: selectedUser.gender || "",
                    //   dob: selectedUser.dob || "",
                    //   role: selectedUser.role || "",
                    //   workplace: selectedUser.workplace || "",
                    //   jobDescription: selectedUser.jobDescription || "",
                    // });

                    // Если длина массива users равна 0 или 1, обновляем его
                    if (users.length == 0) {
                      setUsers([selectedUser]);
                      setCurrentUserId(selectedUser.id);
                    }
                    if (users.length !== 0) {
                      let contains = users.some((user) => user.id === selectedUser.id);
                      if (!contains) {
                        setUsers([...users, selectedUser]);
                        setCurrentUserId(selectedUser.id);
                      }
                      if (contains) {
                        setCurrentUserId(selectedUser.id);
                      }
                    }
                  }
                }}
                loading={loading}
                noOptionsText={
                  <Box sx={{ display: "flex", alignItems: "center", lineHeight: "16px", gap: 1 }}>
                    Пользователь с таким именем не найден
                    <Button variant="text" onClick={() => handleModal(true)}>
                      Добавить
                    </Button>
                  </Box>
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Выберите пользователя"
                    error={Boolean(errors.user)}
                    helperText={errors.user ? errors.user.message : ""}
                    required
                  />
                )}
                slotProps={{
                  listbox: {
                    onScroll: handleScroll,
                    style: { maxHeight: 200, overflow: "auto" },
                  },
                }}
              />
            )}
          />
        </FormControl>

        {error && <div style={{ color: "red", textAlign: "center", marginBottom: "16px" }}>{error}</div>}
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Имя"
                  error={Boolean(errors.first_name)}
                  helperText={errors.first_name ? errors.first_name.message : ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Фамилия"
                  error={Boolean(errors.last_name)}
                  helperText={errors.last_name ? errors.last_name.message : ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  error={Boolean(errors.email)}
                  helperText={errors.email ? errors.email.message : ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="avatar"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="URL аватара"
                  error={Boolean(errors.avatar)}
                  helperText={errors.avatar ? errors.avatar.message : ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="gender"
              control={control}
              rules={{ required: "Пол обязателен" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Выберите пол"
                  select
                  onChange={(e) => handleGenderChange(e.target.value)}
                  error={Boolean(errors.gender)}
                  helperText={errors.gender ? errors.gender.message : ""}
                  required
                  inputProps={{ "aria-hidden": "false" }}
                >
                  <MenuItem value="Мужской">Мужской</MenuItem>
                  <MenuItem value="Женский">Женский</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="dob"
              control={control}
              rules={{
                required: "Дата рождения обязательна",
                validate: (value) => isAdult(value) || "Возраст должен быть не младше 18 лет",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Дата рождения"
                  type="date"
                  onChange={(e) => field.onChange(e.target.value)}
                  error={Boolean(errors.dob)}
                  helperText={errors.dob ? errors.dob.message : ""}
                  sx={{
                    input: { cursor: "pointer" },
                    "& .MuiInputLabel-root": {
                      color: errors.gender ? "red" : "black",
                    },
                    "& .MuiOutlinedInput-root": {
                      borderColor: errors.gender ? "red" : "gray",
                    },
                  }}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </section>

      <section>
        <h3>Работа</h3>
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="role"
              control={control}
              rules={{ required: "Роль обязательна" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Роль"
                  select
                  onChange={(e) => handleRoleChange(e.target.value)}
                  error={Boolean(errors.role)}
                  helperText={errors.role ? errors.role.message : ""}
                >
                  <MenuItem value="Медбрат">Медбрат</MenuItem>
                  <MenuItem value="Медсестра">Медсестра</MenuItem>
                  <MenuItem value="Доктор">Доктор</MenuItem>
                  <MenuItem value="Админ">Админ</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="workplace"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Место работы"
                  error={Boolean(errors.workplace)}
                  helperText={errors.workplace ? errors.workplace.message : ""}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />
          </Grid>
        </Grid>

        <Controller
          name="jobDescription"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Должностные обязанности"
              multiline
              rows={2}
              error={Boolean(errors.jobDescription)}
              helperText={errors.jobDescription ? errors.jobDescription.message : ""}
            />
          )}
        />
      </section>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          display: "block",
          marginTop: "19px",
          marginX: "auto",
          padding: "19px 51px",
          backgroundColor: "#000",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 700,
          borderRadius: "6px",
        }}
      >
        Сохранить
      </Button>
    </Box>
  );
};

export default UsersForm;
