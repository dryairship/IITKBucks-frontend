import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  input: {
    display: 'none',
  },
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
  }
}));

export default function Login(props) {
  const classes = useStyles();

  const [aaStatus, setAAStatus] = useState({});
  const [publicKey, setPublicKey] = useState(null);

  const setErrorMessage = err => setAAStatus({
    display: true,
    severity: "error",
    message: err,
  });

  const newPublicKeyChosen = e => {
    var reader = new FileReader();
    reader.onload = function(){
      var text = reader.result;
      setPublicKey(text);
      console.log(text);
    };
    reader.readAsText(e.target.files[0]);
  }
  const onSubmitClick = () => {
    let alias = document.getElementById("aa-alias").value;
    if(alias===""){
      setErrorMessage("Enter a valid alias.");
      return;
    }
    if(!publicKey){
      setErrorMessage("Choose a public key file.");
      return;
    }
    let data = {
      alias: alias,
      publicKey: publicKey,
    };
    fetch("/addAlias", {
      method: "POST",
      body: JSON.stringify(data),
    })
    .then(res => {
      if(res.status===200){
        setAAStatus({
          display: true,
          severity: "success",
          message: "Successfully added alias.",
        });
        setPublicKey(null);
        document.getElementById("aa-alias").value = "";
      }else{
        setErrorMessage("Could not add alias");
      }
    })
    .catch(err => setErrorMessage(err));
  }

  return (
    <Grid container className={classes.mainContainer} spacing={2} direction="column" fullWidth>
      {aaStatus.display &&
        <Grid item>
          <Alert severity={aaStatus.severity}>{aaStatus.message}</Alert>
        </Grid>
      }
      <Grid item>
        <TextField variant="outlined" required fullWidth autoFocus
          id="aa-alias" label="Alias" name="alias" autoComplete="username"/>
      </Grid>
      <Grid item>
        <input accept="*" className={classes.input} id="aa-choose-public-key" 
          type="file" onChange={newPublicKeyChosen}/>
        <label htmlFor="aa-choose-public-key">
          <Button variant="contained" color="primary" component="span">
            Upload Public Key
          </Button>
        </label>
      </Grid>
      <Grid item>
        {publicKey && 
          <TextField id="outlined-basic" label="Public Key" variant="outlined" 
            disabled fullWidth multiline value={publicKey}/>
          }
      </Grid>
      <Grid item>
        <Button component="span" variant="contained" color="primary" onClick={onSubmitClick}>
          Add Alias
        </Button>
      </Grid>
    </Grid>
  );
}
