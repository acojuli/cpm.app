import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { Post } from "src/types/blog";
import { blogApi } from "src/__next-api__/blog-api";
import { Box, Container, Typography } from "@mui/material";
import { Carousel } from "../carousel";

export const HomeBlogDesktop = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const getPosts = useCallback(async () => {
    try {
      const result = await blogApi.getPosts();
      setPosts(result);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const memoizedPosts = useMemo(() => [...posts, ...posts], [posts]);

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
          Blog e investigación
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
          Qué está pasando en el mundo cripto y por qué es importante. Conocé
          mas sobre las últimas investigaciones del equipo de CPM.
        </Typography>

        <Box sx={{ mt: { xs: 2, md: 4 } }}>
          <Carousel posts={memoizedPosts} />
        </Box>
      </Container>
    </Box>
  );
};
