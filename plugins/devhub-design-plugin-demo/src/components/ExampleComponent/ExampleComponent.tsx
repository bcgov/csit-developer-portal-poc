import { makeStyles } from '@material-ui/core';
import { Grid, Card, CardContent, Typography, Button } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import * as tokens from '@bcgov/design-tokens/js';

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',    
    '&:hover': {
      backgroundColor: 
        theme.palette.type === 'dark'
          ? tokens.themeGray80
          : tokens.surfaceColorMenusHover,
    },
  },
  actionButton: {
    color: tokens.typographyColorLink,
    marginTop: tokens.layoutMarginMedium,
  },
}));

export const ExampleComponent = () => {
  const classes = useStyles();

  return (
    <InfoCard title="My Plugin">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h3" paragraph>
                Card Title
              </Typography>
              <Typography variant="body1">
                Card description using BC Gov design tokens
                and Material-UI components.
              </Typography>
              <Button className={classes.actionButton}>
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h3" paragraph>
                Second Card Title
              </Typography>
              <Typography variant="body1">
                Card description using BC Gov design tokens
                and Material-UI components.
              </Typography>
              <Button className={classes.actionButton}>
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </InfoCard>
  );
};