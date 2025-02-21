import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Proxima Nova', sans-serif", // добавляем шрифт
    allVariants: {
      color: "#3D3A3A", // Цвет для всех текстовых элементов
    },
  },
});

export default theme;
