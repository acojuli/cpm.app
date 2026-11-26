import type { FC } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const BlogNewsletter: FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 2,
        overflow: 'hidden',
        p: { md: 6, xs: 3 }
      }}
    >
      <Grid
        alignItems="center"
        container
        justifyContent="space-between"
        spacing={4}
      >
        <Grid
          item
          md={7}
          xs={12}
        >
          <Typography
            component="h2"
            sx={{ fontSize: { md: 28, xs: 22 }, fontWeight: 700 }}
          >
            Unite a nuestra lista de mailing
          </Typography>
          <Typography
            color="textSecondary"
            sx={{ fontSize: 15, lineHeight: 1.7, mb: 3, mt: 1 }}
          >
            Suscribite a nuestro newsletter para estar al tanto de las
            publicaciones.
          </Typography>
          <TextField
            fullWidth
            label="Correo electrónico"
            name="email"
            type="email"
          />
          <Button
            fullWidth
            size="large"
            sx={{ mt: 2 }}
            variant="contained"
          >
            Suscribirse
          </Button>
        </Grid>
        <Grid
          item
          md={4}
          sx={{
            display: {
              md: 'block',
              xs: 'none'
            }
          }}
        >
          <img
            alt=""
            src={`/static/blog/blog_${theme.palette.mode}.svg`}
            style={{ display: 'block', height: 'auto', width: '100%' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
