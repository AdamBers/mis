import { Box, Button, TextField, MenuItem, Grid, Typography, CircularProgress } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { updateUserRemote } from "../../api/users";

import { isAdult } from "../../utils/validations";
import { IUser } from "../../types";
import UserSelect from "./UserSelect";

interface UsersEditFormProps {
  users: IUser[];
  isModalOpen: boolean;
  toggleSidebar: (value: boolean) => void;
  toggleModal: (value: boolean) => void;
  setUsers: (users: IUser[]) => void;
  currentUser: IUser | null;
  setCurrentUser: (obj: IUser | null) => void;
  snackBarOpen: boolean;
  setSnackBarOpen: (value: boolean) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  message: string;
  setMessage: (value: string) => void;
}

const UsersEditForm = ({
  // snackBarOpen,
  // message,
  users,
  setUsers,
  isModalOpen,
  toggleSidebar,
  toggleModal,
  currentUser,
  setCurrentUser,
  setSnackBarOpen,
  loading,
  setLoading,
  setMessage,
}: UsersEditFormProps) => {
  let buttonText = users.some((user) => user.id === currentUser?.id) ? "Сохранить" : "Добавить";

  const {
    control,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    defaultValues: {
      id: currentUser?.id || undefined,
      first_name: currentUser?.first_name || "",
      last_name: currentUser?.last_name || "",
      email: currentUser?.email || "",
      avatar: currentUser?.avatar || "",
      gender: currentUser?.gender || "",
      role: currentUser?.role || "",
      dob: currentUser?.dob || "",
      university: currentUser?.university || "",
      workplace: currentUser?.workplace || "",
      jobDescription: currentUser?.jobDescription || "",
    },
  });
  const selectedRole = watch("role");

  const addUser = (user: IUser) => {
    const updatedUsers = [...users, user];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setCurrentUser(user);
    setSnackBarOpen(true);
    setMessage("Пользователь успешно добавлен");
  };

  const updateUser = async (user: IUser) => {
    setLoading(true);
    const updatedUsers = users.map((existingUser) => (existingUser.id === user.id ? user : existingUser));
    try {
      if (currentUser?.id) {
        const response = await updateUserRemote(user.id);
        if (response.status === 200) {
          localStorage.setItem("users", JSON.stringify(updatedUsers));
          setUsers(updatedUsers);
          setCurrentUser(user);
          setLoading(false);
          reset();
          setSnackBarOpen(true);
          setMessage("Пользователь успешно обновлен");
        }
      }
    } catch (error) {
      setLoading(false);
      setSnackBarOpen(true);
      setMessage("Не удалось обновить пользователя");
    }
  };

  const onSubmit = (userData: IUser) => {
    if (users.length === 0) {
      addUser(userData);
      reset();
      setCurrentUser(userData);
    }
    if (users.length !== 0) {
      const existingUser = users.find((user) => {
        return user.id === userData.id;
      });

      if (existingUser) {
        updateUser(userData);
      }
      if (!existingUser && userData?.id) {
        addUser(userData);
        setCurrentUser(userData);
        reset();
      }
      if (!existingUser && !userData?.id) {
        const newUser = { ...userData, id: Date.now() };
        addUser(newUser);
        setCurrentUser(newUser);
        reset();
      }
    }
  };

  useEffect(() => {
    reset({
      id: currentUser?.id || undefined,
      first_name: currentUser?.first_name || " ",
      last_name: currentUser?.last_name || "",
      email: currentUser?.email || "",
      avatar: currentUser?.avatar || "",
      gender: currentUser?.gender || "",
      role: currentUser?.role || "",
      dob: currentUser?.dob || "",
      university: currentUser?.university || "",
      workplace: currentUser?.workplace || "",
      jobDescription: currentUser?.jobDescription || "",
    });
  }, [currentUser, users, reset]);

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
      sx={{
        backgroundColor: "#fff",
        maxWidth: "768px",
        maxHeight: { sm: "calc(100vh - 80px)" },
        boxSizing: "border-box",
        position: { xs: "absolute", sm: "relative" },
        zIndex: 100,
        transition: "all 0.5s ease-in-out",
        borderRadius: "30px",
        margin: {
          sm: isModalOpen ? "40px" : "40px 0",
          xs: 0,
        },
        overflowX: "hidden",

        display: { xs: isModalOpen ? "block" : "none", sm: "block" },
        width: {
          sm: isModalOpen ? "768px" : "0px",
          xs: "100%",
        },
      }}
    >
      <Box
        sx={{
          padding: isModalOpen ? "30px 45px" : "30px 45px",
          maxHeight: { sm: "calc(100vh - 80px)" },
          overflowY: "scroll",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontSize: "26px",
            marginBottom: "27px",
          }}
        >
          Редактирование
        </Typography>
        <UserSelect
          users={users}
          setUsers={setUsers}
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          setCurrentUser={setCurrentUser}
          setSnackBarOpen={setSnackBarOpen}
          setMessage={setMessage}
        />
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <CloseOutlinedIcon
            onClick={() => toggleSidebar(false)}
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
          <section>
            <h3>О себе</h3>
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
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
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
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
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
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
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
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
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
                      slotProps={{
                        htmlInput: { "aria-hidden": "false" },
                      }}
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
                    validate: (value) => isAdult(value || "0") || "Возраст должен быть не младше 18 лет",
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
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
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
                      required
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
            disabled={!currentUser?.id || loading}
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
              position: "relative",
            }}
          >
            {loading ? "Загрузка" : buttonText}
            {loading && (
              <CircularProgress
                size={30}
                color="primary"
                sx={{ position: "absolute", top: "calc(50% - 15px)", right: 10 }}
              />
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UsersEditForm;
