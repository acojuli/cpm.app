import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Markdown from 'react-markdown';
import { Avatar, Box, Button, Chip, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { blogApi } from '../../__next-api__/blog-api';
import { BlogNewsletter } from '../../components/blog/blog-newsletter';
import { ArrowLeft as ArrowLeftIcon } from '../../icons/arrow-left';
import { useMounted } from '../../hooks/use-mounted';
import { gtm } from '../../lib/gtm';
import type { Post } from '../../types/blog';
import { MainNavbar } from 'src/components/main-navbar';
import { MainSidebar } from 'src/components/main-sidebar';
import { Footer } from 'src/components/footer';

const MarkdownWrapper = styled('div')(
  ({ theme }) => ({
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    '& h2': {
      color: theme.palette.text.primary,
      fontSize: 24,
      fontWeight: theme.typography.fontWeightBold,
      lineHeight: 1.3,
      margin: theme.spacing(5, 0, 2)
    },
    '& h3': {
      color: theme.palette.text.primary,
      fontSize: 20,
      fontWeight: theme.typography.fontWeightBold,
      lineHeight: 1.3,
      margin: theme.spacing(4, 0, 2)
    },
    '& p': {
      fontSize: 17,
      lineHeight: 1.85,
      marginBottom: theme.spacing(2.5)
    },
    '& li': {
      fontSize: 17,
      lineHeight: 1.85,
      marginBottom: theme.spacing(1)
    },
    '& a': {
      color: theme.palette.primary.main
    }
  })
);

const BlogPostDetails: NextPage = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const postId = router.query.postId?.toString();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getPost = useCallback(async () => {
    if (!postId) {
      return;
    }

    try {
      const data = await blogApi.getPost(postId);

      if (isMounted()) {
        setPost(data);
      }
    } catch (err) {
      if (isMounted()) {
        setNotFound(true);
      }
    }
  }, [isMounted, postId]);

  useEffect(() => {
    getPost();
  }, [getPost]);

  return (
    <>
      <Head>
        <title>{post ? `${post.title} | CPM` : 'CPM | Blog'}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: 10,
          pt: 10
        }}
      >
        <Container maxWidth="md">
          <MainNavbar onOpenSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <MainSidebar
            onClose={(): void => setIsSidebarOpen(false)}
            open={isSidebarOpen}
          />

          <NextLink
            href="/blog"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowLeftIcon fontSize="small" />}
              sx={{ mt: 2 }}
            >
              Volver al blog
            </Button>
          </NextLink>

          {notFound && (
            <Typography
              color="textSecondary"
              sx={{ mt: 4 }}
            >
              No encontramos este artículo.
            </Typography>
          )}

          {post && (
            <>
              <Box sx={{ mt: 3 }}>
                <Chip
                  label={post.category}
                  size="small"
                />
              </Box>
              <Typography
                component="h1"
                sx={{
                  fontSize: { md: 40, xs: 28 },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mt: 2
                }}
              >
                {post.title}
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ fontSize: 18, lineHeight: 1.7, mt: 2 }}
              >
                {post.shortDescription}
              </Typography>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  gap: 1.5,
                  mt: 3
                }}
              >
                <Avatar src={post.author.avatar}>
                  {post.author.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                    {post.author.name}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    sx={{ fontSize: 13 }}
                  >
                    {format(post.publishedAt, "d 'de' MMMM, yyyy", { locale: es })}
                    {' · '}
                    {`${post.readTime} de lectura`}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  aspectRatio: '16 / 9',
                  backgroundImage: `url(${post.cover})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  borderRadius: 2,
                  mt: 4
                }}
              />
              <Box sx={{ py: 4 }}>
                {post.content ? (
                  <MarkdownWrapper>
                    <Markdown>{post.content}</Markdown>
                  </MarkdownWrapper>
                ) : (
                  <Typography color="textSecondary">
                    Este artículo estará disponible próximamente.
                  </Typography>
                )}
              </Box>

              <Box sx={{ mt: 8 }}>
                <BlogNewsletter />
              </Box>
            </>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default BlogPostDetails;
