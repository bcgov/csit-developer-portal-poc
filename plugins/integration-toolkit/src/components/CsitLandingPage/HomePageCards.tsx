import { PropsWithChildren } from 'react';
import {
  ItemCardGrid,
  ItemCardHeader,
  LinkProps,
} from '@backstage/core-components';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
  Box,
  Grid,
  withStyles,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import {
  GitHubSvgIcon,
  RocketChatIcon,
} from '../utils/icons';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ScheduleIcon from '@material-ui/icons/Schedule';
import DocsIcon from '@material-ui/icons/Description';
import { Link } from 'react-router-dom';
import ApiIcon from '@mui/icons-material/Api';
import StorageIcon from '@mui/icons-material/Storage';
import { BCGovHeaderText } from './HomeHeaderText';
import * as tokens from '@bcgov/design-tokens/js';

const CardTitleIcon = withStyles({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.layoutMarginSmall,
    '& .icon': {
      paddingTop: tokens.layoutPaddingXsmall,
    },
  },
})(Box);

interface CardTitleProps {
  icon: React.ReactNode;
  linkProps: LinkProps;
}

const CardTitle = ({
  children,
  icon,
  ...props
}: PropsWithChildren<CardTitleProps>) => {
  return (
    <CardTitleIcon>
      <div className="icon">{icon}</div>
      <Link {...props.linkProps}>{children}</Link>
    </CardTitleIcon>
  );
};

const CardLinkButton = withStyles({
  root: {
    paddingLeft: tokens.layoutPaddingNone,
    paddingRight: tokens.layoutPaddingNone,
    '& .link-text': {
      color: tokens.typographyColorLink,
      transition: 'transform .25s ease',
    },
    '& .icon': {
      fill: tokens.typographyColorLink,
      marginLeft: tokens.layoutMarginXsmall,
      transition: 'transform .25s ease',
    },
    '&:hover': {
      background: 'none',
      '& .link-text': {
        textDecoration: 'none',
        color: tokens.themeBlue80,
      },
      '& .icon': {
        transform: 'translateX(6px)',
        fill: tokens.themeBlue80,
      },
    },
  },
})(Button);

const CardButton = ({ children, ...props }: PropsWithChildren<LinkProps>) => {
  return (
    <CardLinkButton variant="text">
      <Link className="link-text" {...props}>
        {children}
      </Link>
      <ChevronRightIcon className="icon" />
    </CardLinkButton>
  );
};

const useStyles = makeStyles(theme => ({
  cardGroup: {
    paddingTop: tokens.layoutMarginXxxlarge,
  },
  cardGrid: {
    gridTemplateColumns: 'repeat(auto-fit)',
    gridGap: tokens.layoutMarginXlarge,
  },
  card: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    height: '100%',
    '&:hover': {
      background:
        theme.palette.type === 'dark'
          ? tokens.themeGray80
          : tokens.surfaceColorMenusHover,
    },
  },
  cardHeader: {
    backgroundImage: 'none',
    paddingBottom: tokens.layoutPaddingNone,
  },
  gridItem: {
    display: 'flex',
  },
  cardContent: {
    flexGrow: 1,
  },
  background: {
    padding: `0px calc(9% + ${tokens.layoutPaddingLarge}) ${tokens.layoutMarginXxxlarge}`,
    marginLeft: `-${tokens.layoutMarginLarge}`,
    marginRight: `-${tokens.layoutMarginLarge}`,
    background:
      theme.palette.type === 'dark'
        ? tokens.themeGray90
        : tokens.surfaceColorBackgroundLightGray,
  },
  backgroundWhite: {
    padding: `0px calc(9% + ${tokens.layoutPaddingLarge}) ${tokens.layoutMarginXxxlarge}`,
    marginLeft: `-${tokens.layoutMarginLarge}`,
    marginRight: `-${tokens.layoutMarginLarge}`,
    background:
      theme.palette.type === 'dark'
        ? tokens.themeGray90
        : tokens.surfaceColorBackgroundWhite,
  },
  featureList: {
    listStyleType: 'disc',
    paddingLeft: tokens.layoutPaddingLarge,
  },
  featureListTitle: {
    fontWeight: 600,
    marginBottom: tokens.layoutMarginSmall,
    color: tokens.typographyColorPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.layoutMarginSmall,
  },
  featureListItem: {
    paddingLeft: tokens.layoutPaddingNone,
    paddingTop: tokens.layoutPaddingXsmall,
    paddingBottom: tokens.layoutPaddingXsmall,
    display: 'list-item',
  },
}));

export const HomePageCards = () => {
  const classes = useStyles();

  const whatsIncluded = [
    'BC Data Catalogue data integration',
    'CSIT landing page',
    'API Swagger UI',
  ];

  const plannedFeatures = [
    'Global search',
    'CSIT documentation library',
    'API discovery (search, filtering, sorting)',
  ];

  const actions = [
    {
      key: 'a0',
      url: '/docs',
      label: 'Getting started guide',
      icon: <DocsIcon />,
      buttonText: 'Start integrating',
      desc: 'Learn how to build with Connected Services.',
    },
    {
      key: 'a1',
      url: '/api-docs',
      label: 'Browse APIs',
      icon: <ApiIcon />, // Changed to a more appropriate icon
      buttonText: 'Explore APIs',
      desc: 'Discover and connect with powerful government APIs designed to jumpstart your development projects.',
    },
    {
      key: 'a2',
      url: '/catalog',
      label: 'Find data',
      icon: <StorageIcon />, // Changed to represent data
      buttonText: 'Discover government data',
      desc: 'Access government datasets and resources to drive your solutions.',
    },
  ];

  const tools = [
    {
      key: 't1',
      url: 'https://chat.developer.gov.bc.ca',
      label: 'RocketChat',
      icon: <RocketChatIcon />,
      buttonText: 'Message teams',
      desc: 'Connect on an open-source team communication app that offers real-time chat, file sharing and collaboration features.',
    },
    {
      key: 't2',
      url: 'https://github.com/bcgov',
      label: 'GitHub',
      icon: <GitHubSvgIcon />,
      buttonText: 'Find code',
      desc: 'Work together on a web-based version control platform that enables developers to host, review and manage code repositories.',
    },
    {
      key: 't3',
      url: 'https://github.com/bcgov/bcgov-community-discussions',
      label: 'Discussions',
      icon: <GitHubSvgIcon />,
      buttonText: 'Ask a question',
      desc: 'Ask, answer and discuss technical questions specific to the B.C. government. Join the bcgov GitHub organization for access!',
    },
  ];

  return (
    <> 
      <div className={classes.backgroundWhite}>
        <div className={classes.cardGroup}>
          <Grid container spacing={0} justifyContent="space-between">
            <BCGovHeaderText variant="h3" paragraph>
              Thin Slice 1 - March 2026
            </BCGovHeaderText>
            {/* <CardButton to="docs">View all docs</CardButton> */}
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className={classes.featureListTitle}>
                <CheckCircleIcon fontSize="small" />
                What's included
              </Typography>
              <List className={classes.featureList}>
                {whatsIncluded.map((feature, index) => (
                  <ListItem key={index} className={classes.featureListItem}>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className={classes.featureListTitle}>
                <ScheduleIcon fontSize="small" />
                Planned features
              </Typography>
              <List className={classes.featureList}>
                {plannedFeatures.map((feature, index) => (
                  <ListItem key={index} className={classes.featureListItem}>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className={classes.background}>
        <div className={classes.cardGroup}>
          <Grid container spacing={0} justifyContent="space-between">
            <BCGovHeaderText variant="h3" paragraph>
              Connected Services
            </BCGovHeaderText>
            {/* <CardButton to="docs">View all docs</CardButton> */}
          </Grid>

          <Grid container spacing={4} style={{ display: 'flex' }}>
            {actions.map(d => (
              <Grid item key={d.key} sm={12} md={4} className={classes.gridItem}>
                <Card classes={{ root: classes.card }}>
                  <CardMedia>
                    <ItemCardHeader
                      classes={{ root: classes.cardHeader }}
                      title={
                        <CardTitle
                          linkProps={{ to: d.url, title: d.label }}
                          icon={d.icon}
                        >
                          {d.label}
                        </CardTitle>
                      }
                    />
                  </CardMedia>
                  <CardContent className={classes.cardContent}>{d.desc}</CardContent>
                  <CardActions>
                    <CardButton to={d.url} title={d.label}>
                      {d.buttonText}
                    </CardButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>

        <div className={classes.cardGroup}>
          <BCGovHeaderText variant="h3" gutterBottom>
            Get support from the developer community
          </BCGovHeaderText>
          <Typography paragraph>
            We're all here to help! Connect with other developers across the B.C.
            government, ask questions and improve your knowledge.
          </Typography>

          <ItemCardGrid classes={{ root: classes.cardGrid }}>
            {tools.map(t => (
              <Card key={t.key} classes={{ root: classes.card }}>
                <CardMedia>
                  <ItemCardHeader
                    classes={{ root: classes.cardHeader }}
                    title={
                      <CardTitle
                        linkProps={{
                          to: t.url,
                          title: t.label,
                          target: '_blank',
                        }}
                        icon={t.icon}
                      >
                        {t.label}
                      </CardTitle>
                    }
                  />
                </CardMedia>
                <CardContent className={classes.cardContent}>{t.desc}</CardContent>
                <CardActions>
                  <CardButton to={t.url} title={t.label} target="_blank">
                    {t.buttonText}
                  </CardButton>
                </CardActions>
              </Card>
            ))}
          </ItemCardGrid>
        </div>
      </div>
    </>
  );
};
