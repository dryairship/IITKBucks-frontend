import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import { GetBalanceForAlias, GetBalanceForPublicKey  } from '../utils/Balance';

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
  }
}));

export default function CheckBalance(props) {
  const classes = useStyles();

  const [cbStatus, setCBStatus] = useState({});
  const [queryMethod, setQueryMethod] = useState("alias");
  const [publicKey, setPublicKey] = useState(null);

  const setErrorMessage = err => setCBStatus({
    display: true,
    severity: "error",
    message: err,
  });

  const showBalance = balance => setCBStatus({
    display: true,
    severity: "success",
    message: "Your balance is "+ balance,
  });

  const newPublicKeyChosen = e => {
    var reader = new FileReader();
    reader.onload = function(){
      var text = reader.result;
      setPublicKey(text);
    };
    reader.readAsText(e.target.files[0]);
  }

  const handleQueryMethodChange = e => setQueryMethod(e.target.value);

  const onSubmitClick = () => {
    if(queryMethod==="alias"){
      let alias = document.getElementById("cb-alias").value;
      if(alias===""){
        setErrorMessage("Enter a valid alias.");
        return;
      }
      GetBalanceForAlias(alias)
      .then(balance => showBalance(balance))
      .catch(err => setErrorMessage(err));
    }else{
      if(!publicKey){
        setErrorMessage("Choose a public key file.");
        return;
      }
      GetBalanceForPublicKey(publicKey)
      .then(balance => showBalance(balance))
      .catch(err => setErrorMessage(err));
    }
  }

  return (
    <Grid container className={classes.mainContainer} spacing={2} direction="column" fullWidth>
      {cbStatus.display &&
        <Grid item>
          <Alert severity={cbStatus.severity}>{cbStatus.message}</Alert>
        </Grid>
      }
      <Grid item>
        <FormControl component="fieldset">
          <RadioGroup row aria-label="method" name="method" value={queryMethod} onChange={handleQueryMethodChange}>
            <FormControlLabel value="alias" control={<Radio />} label="Alias" />
            <FormControlLabel value="publicKey" control={<Radio />} label="Public Key" />
          </RadioGroup>
        </FormControl>
      </Grid>
      {queryMethod==="alias" &&
        <Grid item>
          <TextField variant="outlined" required fullWidth id="cb-alias"
            label="Alias" name="alias" autoComplete="username" autoFocus/>
        </Grid>
      }
      {queryMethod==="publicKey" &&
        <Grid container className={classes.mainContainer} spacing={2} direction="column" >
          <Grid item>
            <input accept="*" className={classes.input} id="aa-choose-public-key" 
              type="file" onChange={newPublicKeyChosen}/>
            <label htmlFor="aa-choose-public-key">
              <Button variant="contained" color="primary" component="span">
                Choose Public Key
              </Button>
            </label>
          </Grid>
          <Grid item>
            {publicKey && 
              <TextField id="outlined-basic" label="Public Key" variant="outlined" 
                disabled fullWidth multiline value={publicKey.substring(0,100)+"..."}/>
              }
          </Grid>
        </Grid>
      }
      <Grid item>
        <Button type="button" variant="contained" color="primary" onClick={onSubmitClick}>
          Check Balance
        </Button>
      </Grid>
    </Grid>
  );
}
