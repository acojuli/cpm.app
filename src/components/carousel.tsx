import React, { useState } from "react";
import { FC } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Link,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import NextLink from "next/link";
import { format } from "date-fns";
import { getInitials } from "src/utils/get-initials";
import type { Post } from "src/types/blog";
import SwipeableViews from "./swipeable-views";

const POSTS_PER_SLIDE = 3;

export const Carousel: FC<{ posts: Post[] }> = ({ posts }) => {
  const postsInfinito = [...posts, ...posts, ...posts];
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = Math.max(
    Math.ceil(postsInfinito.length / POSTS_PER_SLIDE),
    1
  );

  const handleChangeIndex = (index: number) => {
    setActiveIndex(index);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const handleBack = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  return (
    <Box
      component="div"
      sx={{ alignItems: "center", display: "flex" }}
    >
      <IconButton
        aria-label="Publicaciones anteriores"
        color="inherit"
        onClick={handleBack}
        sx={{ flexShrink: 0 }}
      >
        <ArrowBackIcon
          fontSize="large"
          sx={{
            border: "1px solid rgba(245, 250, 255, 0.35)",
            borderRadius: "50%",
            p: 0.5,
          }}
        />
      </IconButton>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <SwipeableViews
          index={activeIndex}
          onChangeIndex={handleChangeIndex}
        >
          {Array.from({ length: totalSlides }).map((_, index) => {
            const startIndex = index * POSTS_PER_SLIDE;
            const endIndex = startIndex + POSTS_PER_SLIDE;

            return (
              <Grid
                container
                spacing={3}
                justifyContent="center"
                key={index}
                sx={{ py: 2 }}
              >
                {postsInfinito
                  .slice(startIndex, endIndex)
                  .map((post, postIndex) => (
                    <Grid
                      item
                      xs={4}
                      key={`${post.id}-${postIndex}`}
                      sx={{ minWidth: 0 }}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          backgroundColor: "#1c1c1c",
                          border: "1px solid rgba(245, 250, 255, 0.18)",
                          borderRadius: "12px",
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <NextLink
                          href={`/blog/${post.id}`}
                          passHref
                        >
                          <Box
                            component="img"
                            src={post.cover}
                            alt={post.title}
                            sx={{
                              display: "block",
                              height: 150,
                              objectFit: "cover",
                              width: "100%",
                            }}
                          />
                        </NextLink>
                        <CardContent
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: 1,
                            p: 2,
                          }}
                        >
                          <Box sx={{ mb: 2 }}>
                            <Chip
                              label={post.category}
                              size="small"
                            />
                          </Box>
                          <NextLink
                            href={`/blog/${post.id}`}
                            passHref
                          >
                            <Link
                              color="textPrimary"
                              component="a"
                              variant="h5"
                            >
                              {post.title}
                            </Link>
                          </NextLink>
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
                            {post.shortDescription.length > 250
                              ? `${post.shortDescription.substring(0, 250)}...`
                              : post.shortDescription}
                          </Typography>
                          <Box
                            sx={{
                              alignItems: "center",
                              display: "flex",
                              flexGrow: 1,
                              mt: 2,
                            }}
                          >
                            <Avatar
                              src={post.author.avatar}
                              sx={{ height: 32, mr: 1.5, width: 32 }}
                            >
                              {getInitials(post.author.name)}
                            </Avatar>
                            <Typography variant="subtitle2">
                              By{" "}
                              {post.author.name.length > 12
                                ? `${post.author.name.substring(0, 12)}...`
                                : post.author.name}
                              {" • "}
                              {format(post.publishedAt, "dd/MM/yyyy")}
                            </Typography>
                          </Box>
                          <Typography
                            color="textSecondary"
                            sx={{ mt: 1 }}
                            variant="caption"
                          >
                            {post.readTime} de lectura
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            );
          })}
        </SwipeableViews>
      </Box>

      <IconButton
        aria-label="Publicaciones siguientes"
        color="inherit"
        onClick={handleNext}
        sx={{ flexShrink: 0 }}
      >
        <ArrowForwardIcon
          fontSize="large"
          sx={{
            border: "1px solid rgba(245, 250, 255, 0.35)",
            borderRadius: "50%",
            p: 0.5,
          }}
        />
      </IconButton>
    </Box>
  );
};
