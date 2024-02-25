import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Paper } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';

const DailyMenuSlider = () => {
  const [dailyMenus, setDailyMenu] = useState(null);
  const { token } = useAuth();
  const config = { headers: { 'Authorization': `Bearer ${token}` } };

  const NextArrow = ({ onClick }) => {
    return (
      <div
        style={{
          display: "block",
          color: "white",
          padding: "10px",
          borderRadius: "50%",
          right: "25px",
          zIndex: 2,
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          fontSize: '20px',
        }}
        onClick={onClick}
      >&#9654; {/* Unicode para la flecha derecha */}</div>
    );
  };
  
  const PrevArrow = ({ onClick }) => {
    return (
      <div
        style={{
          display: "block",
          color: "white",
          padding: "10px",
          borderRadius: "50%",
          left: "25px",
          zIndex: 2,
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          fontSize: '20px',
        }}
        onClick={onClick}
      >&#9664; {/* Unicode para la flecha izquierda */}</div>
    );
  };
  

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/api/weekly-menu/today', config);
        setDailyMenu(data);
      } catch (error) {
        console.error('Error fetching daily menu:', error);
      }
    };

    fetchMenu();
  }, [token]);

  if (!dailyMenus) return <Typography>Cargando menú...</Typography>;


  return (
    <Slider {...settings}>
      {['breakfast', 'lunch', 'dinner'].map((mealType, index) => {
        const meal = dailyMenus.recipes[0][mealType];
        const mealTitles = ['Desayuno', 'Almuerzo', 'Cena'];
        return (
            <div key={mealType}>
            <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>{mealTitles[index]}</Typography>
            </Box>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" component="h2" gutterBottom>
                {meal.label}
               
              </Typography>
            
              <Box
                component="img"
                sx={{
                  height: 'auto',
                  maxWidth: '100%',
                  borderRadius: '4px',
                  my: 2 // margin top and bottom
                }}
                alt={meal.label}
                src={meal.image}
              />
              <Typography variant="subtitle1" gutterBottom>
                Porciones: {meal.yield}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Ingredientes:
                <Box component="ul" sx={{ textAlign: 'left', pl: 3 }}>
                  {meal.ingredientLines.map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </Box>
              </Typography>
              <Typography variant="body2" gutterBottom>
                Calorías: {meal.calories.toFixed(2)}
              </Typography>
              <Button variant="contained" color="primary" href={meal.url} target="_blank">
                Ver receta completa
              </Button>
            </Paper>
            </div>
          );
      })}
    </Slider>
  );

};

export default DailyMenuSlider;
