import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import CheckBalance from './CheckBalance';
import CreateAccount from './CreateAccount';
import TransferCoins from './TransferCoins';
import AddAlias from './AddAlias';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={4}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TabbedPane(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Check Balance" {...a11yProps(0)} />
            <Tab label="Create Account" {...a11yProps(1)} />
            <Tab label="Transfer Coins" {...a11yProps(2)} />
            <Tab label="Add An Alias" {...a11yProps(3)} />
          </Tabs>
        </AppBar>
      </Grid>
      <Grid item><TabPanel value={value} index={0}>
        <CheckBalance />
      </TabPanel></Grid>
      <Grid item><TabPanel value={value} index={1}>
        <CreateAccount />
      </TabPanel></Grid>
      <Grid item><TabPanel value={value} index={2}>
        <TransferCoins />
      </TabPanel></Grid>
      <Grid item><TabPanel value={value} index={3}>
        <AddAlias />
      </TabPanel></Grid>
    </Grid>
  );
}
