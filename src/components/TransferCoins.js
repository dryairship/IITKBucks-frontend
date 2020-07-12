import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';


import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import CheckBalance from './CheckBalance';
import ReadTextFromFile from '../utils/File';

function getSteps() {
  return ['Your details', 'Transaction details', 'Output details'];
}

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    display: 'none',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(1),
  }
}));

function UserDetails(props) {
  /*
  props = {
    publicKey:
    privateKey:
    setPrivateKey: function
    setPublicKey: function
  }
  */

  const classes = useStyles();

  const [publicKey, setPublicKey] = useState(props.publicKey);
  const [privateKey, setPrivateKey] = useState(props.privateKey);

  const newPublicKeyChosen = e => {
    ReadTextFromFile(e.target.files[0])
    .then(text => {
      setPublicKey(text);
      props.setPublicKey(text);
    });
  }

  const newPrivateKeyChosen = e => {
    ReadTextFromFile(e.target.files[0])
    .then(text => {
      setPrivateKey(text);
      props.setPrivateKey(text);
    });
  }

  return (
    <Grid container>
      <Grid container className={classes.mainContainer} spacing={2} direction="column" >
        <Grid item>
          <input accept="*" className={classes.input} id="tc-choose-public-key" 
            type="file" onChange={newPublicKeyChosen}/>
          <label htmlFor="tc-choose-public-key">
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
      <Grid container className={classes.mainContainer} spacing={2} direction="column" >
        <Grid item>
          <input accept="*" className={classes.input} id="tc-choose-private-key" 
            type="file" onChange={newPrivateKeyChosen}/>
          <label htmlFor="tc-choose-private-key">
            <Button variant="contained" color="primary" component="span">
              Choose Private Key
            </Button>
          </label>
        </Grid>
        <Grid item>
          {privateKey && 
            <TextField id="outlined-basic" label="Private Key" variant="outlined" 
              disabled fullWidth multiline value={privateKey.substring(0,100)+"..."}/>
            }
        </Grid>
      </Grid>
    </Grid>
  );
}


function TransactionDetails(props) {
  /*
  props = {
    numOutputs:
    transactionFees:
    onNumOutputsChange: function
    onTransactionFeesChange: function
  }
  */
  const classes = useStyles();

  return (
    <Grid container className={classes.mainContainer} spacing={2} direction="column" >
      <Grid item>
        <TextField type="number"
          InputProps={{ inputProps: { min: 1 } }}
          label="Number of Outputs"
          value={props.numOutputs}
          onChange={props.onNumOutputsChange}
        />
      </Grid>
      <Grid item>
        <TextField type="number"
          InputProps={{ inputProps: { min: 1 } }}
          value={props.transactionFees}
          label="Transaction Fees"
          onChange={props.onTransactionFeesChange}
        />
      </Grid>
    </Grid>
  );
}

export default function TransferCoins(props) {
  const classes = useStyles();

  const [tcStatus, setTCStatus] = useState({});
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const [publicKey, setPublicKey] = React.useState(null);
  const [privateKey, setPrivateKey] = React.useState(null);

  const [numOutputs, setNumOutputs] = React.useState(1);
  const [transactionFees, setTransactionFees] = React.useState(100);

  const onNumOutputsChange = e => setNumOutputs(parseInt(e.target.value));
  const onTransactionFeesChange = e => setTransactionFees(parseInt(e.target.value));

  const setErrorMessage = err => setTCStatus({
    display: true,
    severity: "error",
    message: err,
  });

  const verifyStep = step => {
    if(step===0){
      if(!publicKey){
        setErrorMessage("You have not chosen a public key");
        return false;
      }
      if(!privateKey){
        setErrorMessage("You have not chosen a private key");
        return false;
      }
      return true;
    }else if(step===1){
      if(!numOutputs || numOutputs<=0){
        setErrorMessage("Choose a valid number of outputs");
        return false;
      }
      if(!transactionFees || transactionFees<=0){
        setErrorMessage("Choose a valid transaction fee");
        return false;
      }
      return true;
    }
    return true;
  }

  const handleNext = () => {
    if(verifyStep(activeStep)){
      setTCStatus({display:false})
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      {tcStatus.display &&
        <Grid item>
          <Alert severity={tcStatus.severity}>{tcStatus.message}</Alert>
        </Grid>
      }
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {index===0 &&
                <UserDetails setPrivateKey={setPrivateKey} setPublicKey={setPublicKey}
                  publicKey={publicKey} privateKey={privateKey} />
              }
              {index===1 &&
                <TransactionDetails
                  numOutputs={numOutputs}
                  transactionFees={transactionFees} 
                  onNumOutputsChange={onNumOutputsChange}
                  onTransactionFeesChange={onTransactionFeesChange}/>
              }
              <div className={classes.actionsContainer}>
                <div>
                  <Button disabled={activeStep === 0}
                    onClick={handleBack} className={classes.button}
                  >
                    Back
                  </Button>
                  <Button variant="contained" color="secondary"
                    onClick={handleNext} className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Transfer Coins' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}
