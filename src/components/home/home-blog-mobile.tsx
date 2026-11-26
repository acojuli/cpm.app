import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Avatar, Box, Card, Container, Typography } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { getInitials } from "src/utils/get-initials";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
  {
    title: "FINANZAS DESCENTRALIZADAS",
    subtitle:
      "Dentro del ecosistema crypto, seguramente escuchaste hablar de DeFi. DeFi significa Finanzas Descentralizadas. Algo así como Wall Street sobre blockchain, pero con más transparencia.",
    imgPath: "/static/blog/defi.png",
    author: {
      avatar: "",
      name: "Mauricio Luduenia",
    },
  },
  {
    title: "ETHEREUM. UNA COMPUTADORA MUNDIAL",
    subtitle:
      "No sería exagerado comparar Ethereum con internet, con un estado o con una gran organización. Conecta usuarios en todo el mundo, tiene sus propias reglas.",
    imgPath: "/static/blog/ethereum.png",
    author: {
      avatar: "",
      name: "CPM",
    },
  },
];

export const HomeBlogMobile = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Box
      component="section"
      sx={{ py: { xs: 6, md: 8 } }}
    >
      <Container maxWidth="md">
        <Typography
          align="left"
          variant="h2"
          sx={{ fontSize: { xs: "2.1rem", sm: "2.6rem" } }}
        >
          Blog e investigación
        </Typography>
        <Typography
          align="left"
          color="textSecondary"
          variant="subtitle2"
          sx={{
            letterSpacing: "0.5px",
            lineHeight: 1.6,
            mt: 1,
          }}
        >
          Qué está pasando en el mundo cripto y por qué es importante. Conocé
          mas sobre las últimas investigaciones del equipo de CPM.
        </Typography>

        <Card
          elevation={0}
          sx={{
            backgroundColor: "#1c1c1c",
            border: "1px solid rgba(245, 250, 255, 0.18)",
            borderRadius: "18px",
            mt: { xs: 3, md: 4 },
            overflow: "hidden",
          }}
        >
          <AutoPlaySwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
            interval={5000}
            slideStyle={{ width: "100%" }}
          >
            {images.map((image, index) => (
              <div key={index}>
                <Box
                  component="img"
                  alt={image.title}
                  src={image.imgPath}
                  sx={{
                    display: "block",
                    height: { xs: 220, sm: 300 },
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
              </div>
            ))}
          </AutoPlaySwipeableViews>

          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h5">{images[activeStep].title}</Typography>
            <Typography
              color="textSecondary"
              sx={{ letterSpacing: "0.4px", lineHeight: 1.6, mt: 1 }}
              variant="body1"
            >
              {images[activeStep].subtitle}
            </Typography>

            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                mt: 2,
              }}
            >
              <Avatar
                src={images[activeStep].author.avatar}
                sx={{ height: 32, mr: 2, width: 32 }}
              >
                {getInitials(images[activeStep].author.name)}
              </Avatar>
              <Typography variant="subtitle2">
                By {images[activeStep].author.name}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              alignItems: "center",
              borderTop: "1px solid rgba(245, 250, 255, 0.12)",
              display: "flex",
              gap: 1,
              justifyContent: "center",
              py: 1.5,
            }}
          >
            {images.map((image, index) => (
              <Box
                component="button"
                type="button"
                key={image.title}
                aria-label={`Ir a ${image.title}`}
                onClick={() => setActiveStep(index)}
                sx={{
                  backgroundColor:
                    index === activeStep
                      ? "primary.main"
                      : "rgba(245, 250, 255, 0.25)",
                  border: 0,
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "block",
                  height: 10,
                  p: 0,
                  transition: "background-color 200ms ease",
                  width: 10,
                }}
              />
            ))}
          </Box>
        </Card>
      </Container>
    </Box>
  );
};
