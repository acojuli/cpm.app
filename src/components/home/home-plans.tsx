import type { FC } from "react";
import { Box } from "@mui/system";
import { Container, Grid, Typography } from "@mui/material";
import { Plan } from "src/types/plan";
import { CardPlan } from "./home-card-plan";

const plans: Plan[] = [
  {
    id: "1",
    cover: "/static/home/foundation.svg",
    title: "Foundation",
    description:
      "Índice que reúne a las 10 plataformas de contratos inteligentes mas importantes y mejor consolidadas del sector.",
    subdescription:
      "Ponderado según la capitalización de mercado y rebalanceado mensualmente.",
    informationLink: "/indice",
    investmentLink: "/dashboard",
  },
];

export const HomePlans: FC = () => {
  return (
    <Box
      component="section"
      sx={{ py: { xs: 6, md: 8 } }}
    >
      <Container maxWidth="lg">
        <Typography
          align="left"
          variant="h2"
          sx={{ fontSize: { xs: "2.1rem", sm: "2.6rem", md: "3.125rem" } }}
        >
          Fondos de inversión cripto
        </Typography>
        <Typography
          align="left"
          color="textSecondary"
          variant="subtitle2"
          sx={{
            letterSpacing: "0.5px",
            lineHeight: 1.6,
            maxWidth: 680,
            mt: 1,
          }}
        >
          Basados en Índices con los principales criptoactivos por sector,
          rebalanceado períodicamente
        </Typography>

        <Grid
          container
          justifyContent="center"
          spacing={4}
          sx={{ mt: { xs: 2, md: 4 } }}
        >
          {plans.map((plan) => (
            <CardPlan
              key={plan.id}
              plan={plan}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
