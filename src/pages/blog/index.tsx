import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Box, Container, Grid, Typography } from '@mui/material';
import { blogApi } from '../../__next-api__/blog-api';
import { BlogNewsletter } from '../../components/blog/blog-newsletter';
import { BlogPostCard } from '../../components/blog/blog-post-card';
import { useMounted } from '../../hooks/use-mounted';
import { gtm } from '../../lib/gtm';
import type { Post } from '../../types/blog';
import { MainNavbar } from 'src/components/main-navbar';
import { MainSidebar } from 'src/components/main-sidebar';
import { Footer } from 'src/components/footer';

const BlogPostList: NextPage = () => {
  const isMounted = useMounted();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleOpenSideBar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getPosts = useCallback(async () => {
    try {
      const data = await blogApi.getPosts();

      if (isMounted()) {
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <>
      <Head>
        <title>CPM | Blog</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: 10,
          pt: 10
        }}
      >
        <Container maxWidth="lg">
          <MainNavbar onOpenSidebar={handleOpenSideBar} />
          <MainSidebar
            onClose={(): void => setIsSidebarOpen(false)}
            open={isSidebarOpen}
          />

          <Box sx={{ maxWidth: 720, mb: { md: 7, xs: 4 }, mt: { md: 4, xs: 1 } }}>
            <Typography
              color="primary"
              variant="overline"
            >
              Blog
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontSize: { md: 44, xs: 30 },
                fontWeight: 700,
                lineHeight: 1.15,
                mb: 2,
                mt: 0.5
              }}
            >
              Blog de criptomonedas
            </Typography>
            <Typography
              color="textSecondary"
              sx={{ fontSize: 17, lineHeight: 1.7 }}
            >
              Guías y análisis para entender el ecosistema cripto y tomar
              mejores decisiones de inversión.
            </Typography>
          </Box>

          <Grid
            container
            spacing={3}
          >
            {posts.map((post) => (
              <Grid
                item
                key={post.id}
                md={6}
                xs={12}
              >
                <BlogPostCard
                  authorAvatar={post.author.avatar}
                  authorName={post.author.name}
                  category={post.category}
                  cover={post.cover}
                  id={post.id}
                  publishedAt={post.publishedAt}
                  readTime={post.readTime}
                  shortDescription={post.shortDescription}
                  title={post.title}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 10 }}>
            <BlogNewsletter />
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default BlogPostList;
