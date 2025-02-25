import { Modal, Box, TextField, Button, Typography, Grid } from "@mui/material";
import { useState } from "react";
import { IUser } from "../../types";
import { addUserRemote } from "../../api/users";

interface IModalFormProps {
  open: boolean;
  toggleModal: (value: boolean) => void;
  users: IUser[];
  setUsers: (users: IUser[]) => void;
  setCurrentUser: (user: IUser) => void;
  setSnackBarOpen: (value: boolean) => void;
  setMessage: (text: string) => void;
}

const ModalForm = ({
  open,
  toggleModal,
  users,
  setUsers,
  setCurrentUser,
  setSnackBarOpen,
  setMessage,
}: IModalFormProps) => {
  const addUser = async (user: IUser) => {
    try {
      const response = await addUserRemote(user);
      if (response.status === 201) {
        const updatedUsers = [...users, user];
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        setCurrentUser(user);
        setSnackBarOpen(true);
        setMessage("Пользователь успешно добавлен");
      }
    } catch (error: any) {
      setSnackBarOpen(true);
      setMessage("Ошибка при добавлении пользователя");
      throw new Error(error || "Ошибка при добавлении пользователя");
    }
  };
  const [formData, setFormData] = useState({
    id: Number(Date.now().toString()),
    email: "",
    first_name: "",
    last_name: "",
    avatar: "",
  });

  const [errors, setErrors] = useState({
    id: false,
    email: false,
    first_name: false,
    last_name: false,
    avatar: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      id: false,
      email: !formData.email,
      first_name: !formData.first_name,
      last_name: !formData.last_name,
      avatar: !formData.avatar,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).includes(true)) {
      return;
    }
    addUser(formData);
    setFormData({ id: 0, email: "", first_name: "", last_name: "", avatar: "" });
    toggleModal(false);
  };

  return (
    <Modal open={open} onClose={() => toggleModal(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Добавление нового пользователя
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                error={errors.email}
                helperText={errors.email ? "Email is required" : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                fullWidth
                required
                error={errors.first_name}
                helperText={errors.first_name ? "First name is required" : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
                required
                error={errors.last_name}
                helperText={errors.last_name ? "Last name is required" : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Avatar URL"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                fullWidth
                required
                error={errors.avatar}
                helperText={errors.avatar ? "Avatar is required" : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" type="submit" fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalForm;
