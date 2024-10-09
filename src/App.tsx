import { useState, KeyboardEvent } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled from "styled-components";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Box,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { ThemeProvider, createTheme } from "@mui/material/styles";

interface Ingredient {
  id: number;
  name: string;
  weight: number;
}

const AppContainer = styled(Paper)`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
  background-color: #f0f0f0;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  && {
    margin-top: 1rem;
    background-color: #ff6b6b;
    color: white;
    &:hover {
      background-color: #ff8787;
    }
  }
`;

const StyledListItem = styled(ListItem)`
  && {
    background-color: white;
    margin-bottom: 0.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff6b6b",
    },
    secondary: {
      main: "#4ecdc4",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

function App() {
  const [ingredients, setIngredients] = useLocalStorageState<Ingredient[]>("ingredients", {
    defaultValue: [],
  });
  const [newIngredientName, setNewIngredientName] = useState("");
  const [newIngredientWeight, setNewIngredientWeight] = useState("");

  const handleAddIngredient = () => {
    if (newIngredientName.trim() !== "" && newIngredientWeight.trim() !== "") {
      setIngredients([
        ...ingredients,
        {
          id: Date.now(),
          name: newIngredientName.trim(),
          weight: parseFloat(newIngredientWeight),
        },
      ]);
      setNewIngredientName("");
      setNewIngredientWeight("");
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleAddIngredient();
    }
  };

  const handleDeleteIngredient = (id: number) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
  };

  const handleWeightChange = (id: number, newWeight: string) => {
    const oldWeight = ingredients.find((ingredient) => ingredient.id === id)?.weight || 0;
    const ratio = parseFloat(newWeight) / oldWeight;

    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.id === id
          ? { ...ingredient, weight: parseFloat(newWeight) }
          : { ...ingredient, weight: ingredient.weight * ratio }
      )
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Recipe Calculator
        </Typography>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            variant="outlined"
            label="Ingredient Name"
            value={newIngredientName}
            onChange={(e) => setNewIngredientName(e.target.value)}
            style={{ width: "55%" }}
          />
          <TextField
            variant="outlined"
            label="Weight (g)"
            type="number"
            value={newIngredientWeight}
            onChange={(e) => setNewIngredientWeight(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ width: "40%" }}
          />
        </Box>
        <StyledButton
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddIngredient}
          startIcon={<AddIcon />}
        >
          Add Ingredient
        </StyledButton>
        <List>
          {ingredients.map((ingredient) => (
            <StyledListItem key={ingredient.id}>
              <Typography variant="body1" style={{ flexGrow: 1, marginRight: '1rem' }}>
                {ingredient.name}
              </Typography>
              <TextField
                variant="outlined"
                type="number"
                value={ingredient.weight.toFixed(2)}
                onChange={(e) => handleWeightChange(ingredient.id, e.target.value)}
                style={{ width: "150px", marginRight: "1rem" }}
                InputProps={{
                  endAdornment: <Typography variant="caption">g</Typography>,
                }}
              />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteIngredient(ingredient.id)}
              >
                <DeleteIcon />
              </IconButton>
            </StyledListItem>
          ))}
        </List>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
