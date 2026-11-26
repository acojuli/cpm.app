import type { FC } from 'react';
import NextLink from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Avatar, Box, Chip, Link, Typography } from '@mui/material';
import { getInitials } from '../../utils/get-initials';

interface BlogPostCardProps {
  authorAvatar: string;
  authorName: string;
  category: string;
  cover: string;
  id: string;
  publishedAt: number;
  readTime: string;
  shortDescription: string;
  title: string;
}

export const BlogPostCard: FC<BlogPostCardProps> = (props) => {
  const {
    authorAvatar,
    authorName,
    category,
    cover,
    id,
    publishedAt,
    readTime,
    shortDescription,
    title
  } = props;

  const href = `/blog/${id}`;

  return (
    <Box
      component="article"
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        transition: 'border-color 150ms ease',
        '&:hover': {
          borderColor: 'rgba(0, 255, 51, 0.5)'
        }
      }}
    >
      <NextLink
        href={href}
        passHref
      >
        <Box
          aria-label={title}
          component="a"
          sx={{
            aspectRatio: '16 / 9',
            backgroundImage: `url(${cover})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            display: 'block'
          }}
        />
      </NextLink>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          p: 3
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Chip
            label={category}
            size="small"
          />
        </Box>
        <NextLink
          href={href}
          passHref
        >
          <Link
            color="textPrimary"
            component="a"
            sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}
            underline="hover"
          >
            {title}
          </Link>
        </NextLink>
        <Typography
          color="textSecondary"
          sx={{
            display: '-webkit-box',
            fontSize: 15,
            lineHeight: 1.7,
            mt: 1.5,
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3
          }}
        >
          {shortDescription}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 1.5,
            mt: 3
          }}
        >
          <Avatar
            src={authorAvatar}
            sx={{ height: 36, width: 36 }}
          >
            {getInitials(authorName)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              noWrap
              sx={{ fontSize: 14, fontWeight: 600 }}
            >
              {authorName}
            </Typography>
            <Typography
              color="textSecondary"
              sx={{ fontSize: 13 }}
            >
              {format(publishedAt, "d 'de' MMMM, yyyy", { locale: es })}
              {' · '}
              {`${readTime} de lectura`}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
