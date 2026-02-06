import React, { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  makeStyles,
  Theme
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    width: 'auto',
    margin: '0 8px',
    minWidth: 'fit-content',
  },
  select: {
    color: theme.palette.navigation.color,
    fontSize: '0.875rem',
    paddingRight: '24px !important',
    paddingLeft: '8px',
    '&:before': {
      borderColor: 'inherit',
    },
    '&:after': {
      borderColor: 'inherit',
    },
    '& .MuiSelect-icon': {
      color: 'inherit',
    },
  },
}));

const themes = [
  { id: 'devex', label: 'DevEx Theme' },
  { id: 'light', label: 'Light Theme' },
  { id: 'dark', label: 'Dark Theme' },
];

export const ThemeSwitcher = () => {
  const classes = useStyles();
  const [currentTheme, setCurrentTheme] = useState<string>('devex');

  useEffect(() => {
    // Read theme from localStorage
    const storedTheme = localStorage.getItem('theme') || 'devex';
    setCurrentTheme(storedTheme);
  }, []);

  const handleThemeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newTheme = event.target.value as string;
    localStorage.setItem('theme', newTheme);
    setCurrentTheme(newTheme);
    // Reload the page to apply the new theme
    window.location.reload();
  };

  return (
    <FormControl className={classes.formControl} size="small">
      <Select
        value={currentTheme}
        onChange={handleThemeChange}
        className={classes.select}
        displayEmpty
        inputProps={{
          name: 'theme',
          id: 'theme-select',
        }}
      >
        {themes.map((theme) => (
          <MenuItem key={theme.id} value={theme.id}>
            {theme.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

