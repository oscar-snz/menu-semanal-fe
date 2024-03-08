import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Paper } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from '../../utils/axiosWithInterceptor';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { utcToZonedTime } from 'date-fns-tz';
const moment = require('moment-timezone');


const DailyMenuSlider = () => {
  const router = useRouter();
  const [dailyMenu, setDailyMenu] = useState(null);
  const { date } = router.query; // Obtén la fecha de la URL
  const { token } = useAuth();
  const config = { headers: { 'Authorization': `Bearer ${token}` } };
  const today = moment().tz('America/Guatemala').startOf('day'); // Ajusta a tu zona horaria
  const todayStr = today.format('YYYY-MM-DD'); // Formatea la fecha como 'YYYY-MM-DD'
  const [formattedDate, setFormattedDate] = useState('');

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
    if (date) {
    const zonedDate = utcToZonedTime(date, 'UTC');
    const newFormattedDate = format(zonedDate, 'EEEE d \'de\' MMMM \'de\' yyyy', { locale: es });
    setFormattedDate(newFormattedDate);
    }
    const fetchMenu = async () => {
      try {
        const url = (date && date !== 'undefined')
        ? `http://localhost:3001/api/weekly-menu/byDate?date=${date}`
        : `http://localhost:3001/api/weekly-menu/byDate?date=${todayStr}`;

        const { data } = await axios.get(url, config);
        if (data && data.length > 0) {
          // Asume que solo hay un menú por día y usa el primer objeto del arreglo
          setDailyMenu(data[0]);
        } else {
          // Maneja el caso en que no hay datos
          setDailyMenu(null);
        }
      } catch (error) {
        console.error('Error fetching daily menu:', error);
      }
    };

    fetchMenu();
  }, [token]);

  if (!dailyMenu) return <Typography>No ha configurado menu para este dia.</Typography>;

  

   
    return (
      <>
        <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>
          {formattedDate}
        </Typography>
        <Slider {...settings}>
          {['breakfast', 'lunch', 'dinner'].map((mealType, mealIndex) => {
            const meal = dailyMenu[mealType];
            if (!meal) return null; // Si no hay comida de este tipo, no renderizar nada para este slide.
            const mealTitles = ['Desayuno', 'Almuerzo', 'Cena'];
    
            return (
              <div key={mealType}> {/* Cada comida ahora está en su propio div, que actúa como un slide separado. */}
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <Typography variant="h4" gutterBottom>{mealTitles[mealIndex]}</Typography>
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
                      my: 2
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
                      {meal.ingredientLines.map((line, lineIndex) => (
                        <li key={lineIndex}>{line}</li>
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
      </>
    );
    
          
  
  
  

};

export default DailyMenuSlider;
