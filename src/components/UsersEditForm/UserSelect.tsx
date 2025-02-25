import { Box, Button, TextField, FormControl, Autocomplete } from "@mui/material";
import { getUsers } from "../../api/users";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { IUser } from "../../types";

interface UserSelectProps {
  users: IUser[];
  setUsers: (users: IUser[]) => void;
  isModalOpen: boolean;
  toggleModal: (value: boolean) => void;
  setCurrentUser: (user: IUser) => void;
  setSnackBarOpen: (value: boolean) => void;
  setMessage: (value: string) => void;
}

const UserSelect = ({
  users,
  isModalOpen,
  toggleModal,
  setCurrentUser,
  setSnackBarOpen,
  setMessage,
}: UserSelectProps) => {
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [_, setError] = useState<string | null>(null);
  const [userList, setUserList] = useState<IUser[]>([]);
  const isFetching = useRef(false);
  const [page, setPage] = useState(1);

  const { control, reset } = useForm<IUser>({
    defaultValues: {
      id: 0,
      first_name: "",
      last_name: "",
      email: "",
      gender: "",
      role: "",
      dob: "",
      university: "",
      workplace: "",
      jobDescription: "",
    },
  });

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const target = event.currentTarget;
    const bottom = target.scrollHeight === target.scrollTop + target.clientHeight;

    if (bottom && !loading && page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const fetchUsersData = async (pageNumber: number) => {
    if (isFetching.current) {
      return;
    }
    isFetching.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers(pageNumber);
      if (response.status === 200) {
        setUserList((prevUsers) => [...prevUsers, ...response.data.data]);
        setTotalPages(response.data.total_pages);
      }
    } catch (error) {
      setSnackBarOpen(true);
      setMessage("Ошибка при загрузке списка пользователей");
      setError("Не удалось загрузить пользователей. Пожалуйста, попробуйте позже.");
    }
    setLoading(false);
    isFetching.current = false;
  };

  useEffect(() => {
    setUserList([]);
    setPage(1);
    setTotalPages(1);
    fetchUsersData(1);
    reset();
  }, [isModalOpen, reset]);

  useEffect(() => {
    if (page > 1) {
      fetchUsersData(page);
    }
  }, [page]);

  return (
    <>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <Controller
          name="id"
          control={control}
          rules={{ required: "Пользователь обязателен" }}
          render={({ field }) => (
            // @ts-ignore
            <Autocomplete
              {...field}
              options={userList}
              getOptionLabel={(option) => `${option.last_name} ${option.first_name.charAt(0)}.`}
              onChange={(_, selectedUser) => {
                if (selectedUser) {
                  setCurrentUser(selectedUser);
                  field.onChange(selectedUser);
                }
              }}
              loading={loading}
              noOptionsText={
                userList.length > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", lineHeight: "16px", gap: 1 }}>
                    Пользователь с таким именем не найден
                    <Button variant="text" onClick={() => toggleModal(true)}>
                      Добавить
                    </Button>
                  </Box>
                )
              }
              renderInput={(params) => <TextField {...params} label="Выберите пользователя" required />}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionDisabled={(option) => users.some((user) => user.id === option.id)}
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
    </>
  );
};

export default UserSelect;
