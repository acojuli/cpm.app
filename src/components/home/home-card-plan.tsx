import {
  Button,
  Card,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Plan } from "src/types/plan";
import NextLink from "next/link";
import { FC } from "react";
import Performance from "../indices/performance";

interface Props {
  plan: Plan;
}

export const CardPlan: FC<Props> = ({ plan }: Props) => {
  return (
    <Grid
      item
      xs={12}
      lg={9}
    >
      <Card
        sx={{
          backgroundColor: "#1c1c1c",
          border: "1px solid rgba(245, 250, 255, 0.18)",
          borderRadius: "16px",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Grid
          container
          sx={{ height: "100%" }}
        >
          <Grid
            item
            xs={12}
            md={5}
          >
            <Box
              sx={{
                height: { xs: 220, md: "100%" },
                minHeight: { md: 400 },
                position: "relative",
              }}
            >
              <Box
                component="img"
                src={plan.cover}
                alt={plan.title}
                sx={{
                  height: "100%",
                  inset: 0,
                  objectFit: "cover",
                  objectPosition: "center",
                  position: "absolute",
                  width: "100%",
                }}
              />
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={7}
          >
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h5">{plan.title}</Typography>
              <Typography
                color="textSecondary"
                sx={{
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                  mt: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                variant="body1"
              >
                {plan.description}
              </Typography>
              <Typography
                color="textSecondary"
                sx={{
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  mt: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                variant="body1"
              >
                {plan.subdescription}
              </Typography>

              <Typography
                variant="h5"
                sx={{ mb: 1, mt: { xs: 2, md: 3 } }}
              >
                Rendimiento
              </Typography>
              <Performance />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 3 }}
              >
                <NextLink
                  href={plan.informationLink}
                  passHref
                >
                  <Button
                    component="a"
                    fullWidth
                    size="large"
                    variant="outlined"
                  >
                    Conocer más
                  </Button>
                </NextLink>
                <NextLink
                  href={plan.investmentLink}
                  passHref
                >
                  <Button
                    component="a"
                    fullWidth
                    size="large"
                    variant="contained"
                  >
                    Invertir
                  </Button>
                </NextLink>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
