import { Modal, Box, TextField, Button, Typography, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { IUser } from "../../types";

interface IModalFormProps {
  open: boolean;
  handleModal: (value: boolean) => void;
  userData: {
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  addUser: (data: IUser) => void;
}

const ModalForm = ({ open, handleModal, userData, addUser }: IModalFormProps) => {
  const [formData, setFormData] = useState({
    id: Number(Date.now().toString()), // Инициализируем id текущей меткой времени
    email: userData?.email || "",
    first_name: userData?.first_name || "",
    last_name: userData?.last_name || "",
    avatar: userData?.avatar || "",
  });

  const [errors, setErrors] = useState({
    id: false,
    email: false,
    first_name: false,
    last_name: false,
    avatar: false,
  });

  const handleClose = () => {
    handleModal(false);
  };

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

    // Проверяем, есть ли ошибки
    if (Object.values(newErrors).includes(true)) {
      return;
    }

    // Здесь можно добавить логику для отправки данных формы
    console.log("Form submitted", formData);
    addUser(formData);
    setFormData({ id: 0, email: "", first_name: "", last_name: "", avatar: "" });
    handleClose(); // Закрыть модальное окно после успешной отправки
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
            {/* Поле для Email */}
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

            {/* Поле для First Name */}
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

            {/* Поле для Last Name */}
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

            {/* Поле для Avatar URL */}
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
