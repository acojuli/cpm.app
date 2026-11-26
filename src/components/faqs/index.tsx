import React from 'react';
import data from './data.json';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Link } from '@mui/material';

export const AccordionComponent = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {data.map((item) => (
        <Accordion
          disableGutters
          elevation={0}
          key={item.id}
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px !important',
            overflow: 'hidden',
            '&:before': { display: 'none' },
            '&.Mui-expanded': {
              borderColor: 'rgba(0, 255, 51, 0.4)'
            }
          }}
        >
          <AccordionSummary
            aria-controls={`panel${item.id}-content`}
            expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
            id={`panel${item.id}-header`}
            sx={{ px: 3, py: 0.5 }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
              {item.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
            <Typography
              color="textSecondary"
              sx={{ fontSize: 15, lineHeight: 1.8 }}
            >
              {item.content}
              {item.link && (
                <Link
                  href={item.link.url}
                  underline="always"
                >
                  {item.link.text}
                </Link>
              )}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
