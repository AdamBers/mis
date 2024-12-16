// UsersForm.tsx
import {
  Modal,
  Button,
  Box,
  TextField,
  MenuItem,
  FormControl,
  CircularProgress,
  Grid,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { getUsers, IUser, GetUsersResponse } from "../../api/users";
import { isAdult } from "../../utils/isAdult";

interface UsersFormProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormValues {
  user: IUser | null;
  gender: string;
  role: string;
  dob: string;
  university: string;
  graduationYear: string;
  workplace: string;
  jobDescription: string;
}

const UsersForm = ({ open, setOpen }: UsersFormProps) => {
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

  const onSubmit = (data: FormValues) => {
    console.log("submit", data);
    // Реализуйте логику отправки формы
  };

  const [userList, setUserList] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const isFetching = useRef(false);

  const fetchUsersData = async (pageNumber: number) => {
    if (isFetching.current) {
      console.log(`Запрос для страницы ${pageNumber} уже выполняется.`);
      return;
    }

    isFetching.current = true;
    setLoading(true);
    setError(null); // Сброс ошибки перед новым запросом
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

  useEffect(() => {
    if (open) {
      setUserList([]);
      setPage(1);
      setTotalPages(1);
      fetchUsersData(1);
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (page > 1) {
      fetchUsersData(page);
    }
  }, [page]);

  const handleClose = () => {
    setOpen(false);
  };

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
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          backgroundColor: "#fff",
          maxWidth: "768px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 2,
          margin: "auto",
          borderRadius: 3,
          marginTop: 2,
        }}
      >
        <h2>Форма</h2>
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
                  onChange={(_, data) => field.onChange(data)}
                  loading={loading}
                  noOptionsText={error ? "Ошибка загрузки" : "Нет пользователей"}
                  onInputChange={(_, value) => {
                    // Реализуйте логику поиска, если необходимо
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Пользователь"
                      error={Boolean(errors.user)}
                      helperText={errors.user ? errors.user.message : ""}
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
                name="gender"
                control={control}
                rules={{ required: "Пол обязателен" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Пол"
                    select
                    onChange={(e) => handleGenderChange(e.target.value)}
                    error={Boolean(errors.gender)}
                    helperText={errors.gender ? errors.gender.message : ""}
                  >
                    <MenuItem value="Мужской">Мужской</MenuItem>
                    <MenuItem value="Женский">Женский</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
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
          </Grid>

          <Grid container spacing={2}>
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
                    sx={{ input: { cursor: "pointer" } }}
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
          <h3>Образование</h3>
          <Controller
            name="university"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="ВУЗ"
                onChange={(e) => field.onChange(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            )}
          />
          <Controller
            name="graduationYear"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Год окончания"
                type="number"
                onChange={(e) => field.onChange(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            )}
          />
        </section>

        <section>
          <h3>Работа</h3>
          <Controller
            name="workplace"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Место работы"
                onChange={(e) => field.onChange(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            )}
          />
          <Controller
            name="jobDescription"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Должностные обязанности"
                onChange={(e) => field.onChange(e.target.value)}
                sx={{ marginBottom: 2 }}
                multiline
                rows={3}
              />
            )}
          />
        </section>

        <Button
          type="submit" // Убедитесь, что тип кнопки установлен как "submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginBottom: 2,
            width: "max-content",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Добавить/Сохранить
        </Button>

        {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
        {!loading && page >= totalPages && (
          <div style={{ textAlign: "center", marginTop: "16px", color: "gray" }}>Все пользователи загружены</div>
        )}
      </Box>
    </Modal>
  );
};

export default UsersForm;
