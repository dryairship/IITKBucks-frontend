import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {GetBalanceFromOutputs} from '../utils/Balance';
import {GetUnusedOutputsForPublicKey} from '../utils/UnusedOutputs';
import ReadTextFromFile from '../utils/File';
import MakeTransactionRequest from '../utils/Transaction';

// Why do need to do all this to use BigInt? 
/* global BigInt */
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function() { return this.toString(); };

function getSteps() {
  return ['Your details', 'Transaction details', 'Output details'];
}

const defaultOutputDetails = {
  publicKey: null,
  alias: "",
  queryMethod: "alias",
  amount: "1",
};

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
    balance:
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
          disabled
          label="Balance"
          value={props.balance}
        />
      </Grid>
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

function OutputDetailsRow(props) {
  /*
  props = {
    updateDetails: function
    currentDetails:
    index:
  }
  */
  const classes = useStyles();

  const [queryMethod, setQueryMethod] = useState(props.currentDetails.queryMethod);
  const [publicKey, setPublicKey] = useState(props.currentDetails.publicKey);
  const [alias, setAlias] = useState(props.currentDetails.alias);
  const [amount, setAmount] = useState(props.currentDetails.amount);
  // amount is a string throughout in this container

  const newPublicKeyChosen = e => {
    var reader = new FileReader();
    reader.onload = function(){
      var text = reader.result;
      setPublicKey(text);
    };
    reader.readAsText(e.target.files[0]);
  }

  const handleQueryMethodChange = e => setQueryMethod(e.target.value);
  const handleAliasChange = e => setAlias(e.target.value);
  const handleAmountChange = e => setAmount(e.target.value);

  const informParent = () => {
    props.updateDetails(
      props.index,
      {
        alias: alias,
        queryMethod: queryMethod,
        publicKey: publicKey,
        amount: amount,
      }
    );
  }
  React.useEffect(informParent, [queryMethod, publicKey, alias, amount]);

  return (
    <TableRow key={props.roll}>
      <TableCell component="th" scope="row">
        {props.index}
      </TableCell>
      <TableCell align="center">
        <FormControl component="fieldset">
          <RadioGroup aria-label="method" name="method" value={queryMethod} onChange={handleQueryMethodChange}>
            <FormControlLabel value="alias" control={<Radio />} label="Alias" />
            <FormControlLabel value="publicKey" control={<Radio />} label="Public Key" />
          </RadioGroup>
        </FormControl>
      </TableCell>
      <TableCell align="center">
        {queryMethod==="alias" &&
          <TextField variant="outlined" required label="Alias" name="alias" autoComplete="username"
            value={alias} onChange={handleAliasChange}/>
        }
        {queryMethod==="publicKey" &&
          <Grid container className={classes.mainContainer} spacing={2} direction="column" >
            <Grid item>
              <input accept="*" className={classes.input} id={"tc-recipient-pubkey-"+props.index}
                type="file" onChange={newPublicKeyChosen}/>
              <label htmlFor={"tc-recipient-pubkey-"+props.index}>
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
      </TableCell>
      <TableCell align="center">
        <TextField type="number"
          InputProps={{ inputProps: { min: 1 } }}
          label="Amount"
          value={amount}
          onChange={handleAmountChange}
        />
      </TableCell>
    </TableRow>
  );
}

function OutputDetails(props) {
  /*
  props = {
    numOutputs:
    outputDetails:
    setOutputDetails:
  }
  */
  
  const updateDetails = (index, newDetails) => {
    let copyOfDetails = props.outputDetails;
    copyOfDetails[index] = newDetails;
    props.setOutputDetails(copyOfDetails);
  }
  
  return (
    <TableContainer>
      <Table aria-label="Details of outputs">
        <TableHead>
          <TableRow>
            <TableCell align="center">Index</TableCell>
            <TableCell align="center">Recipient Identifier</TableCell>
            <TableCell align="center">Identifier Value</TableCell>
            <TableCell align="center">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.outputDetails.map((output, index) =>
            <OutputDetailsRow updateDetails={updateDetails}
              currentDetails={output} key={index} index={index}/>
          )}
        </TableBody>
      </Table>
    </TableContainer>
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
  const [transactionFees, setTransactionFees] = React.useState("100");

  const [outputDetails, setOutputDetails] = React.useState(new Array(numOutputs? numOutputs:1).fill().map(output => defaultOutputDetails));

  const [unusedOutputs, setUnusedOutputs] = React.useState([]);
  const [balance, setBalance] = React.useState(0);

  const onNumOutputsChange = e => setNumOutputs(parseInt(e.target.value));
  const onTransactionFeesChange = e => setTransactionFees(e.target.value);

  const resizeOutputDetails = () => {
    if(numOutputs){
      setOutputDetails(new Array(numOutputs).fill().map(output => defaultOutputDetails));
    }
  }
  React.useEffect(resizeOutputDetails, [numOutputs]);

  const setErrorMessage = err => setTCStatus({
    display: true,
    severity: "error",
    message: err.toString(),
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
    }else if(step===1){
      if(!numOutputs || numOutputs<=0){
        setErrorMessage("Choose a valid number of outputs");
        return false;
      }
      if(!parseInt(transactionFees) || parseInt(transactionFees)<=0){
        setErrorMessage("Choose a valid transaction fee");
        return false;
      }
    }else if(step===2){
      for(let i=0; i<numOutputs; i++){
        let output = outputDetails[i];
        if(!parseInt(output.amount) || parseInt(output.amount)<=0){
          setErrorMessage("Choose a valid amount for output at index "+i);
          return false;
        }
        if(output.queryMethod==="alias" && !output.alias){
          setErrorMessage("Enter a valid alias for output at index "+i);
          return false;
        }
        if(output.queryMethod==="publicKey" && !output.publicKey){
          setErrorMessage("CHoose a valid public key for output at index "+i);
          return false;
        }
      }
    }
    return true;
  }

  const handleNext = () => {
    if(verifyStep(activeStep)){
      setTCStatus({display:false});
      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      if(activeStep===0){
        let oldStep = activeStep;
        GetUnusedOutputsForPublicKey(publicKey)
        .then(outputs => {
          setUnusedOutputs(outputs);
          setBalance(GetBalanceFromOutputs(outputs));
        })
        .catch(err => {
          setErrorMessage(err)
          setActiveStep(oldStep);
        });
      }
      if(activeStep===2){
        makeTransaction();
      }
    }
  };

  const makeTransaction = () => {
    MakeTransactionRequest({
      publicKey: publicKey,
      privateKey: privateKey,
      unusedOutputs: unusedOutputs,
      transactionFees: transactionFees,
      outputDetails: outputDetails,
    }).then(data => fetch("/newTransaction", {
      method: "POST",
      body: JSON.stringify(data),
    }))
    .then(res => {
      if(res.status === 200){
        setTCStatus({
          display: true,
          severity: "success",
          message: "Transaction successfully added. Wait for some time for it to get included in a block.",
        });
      } else {
        setErrorMessage("Could not make transaction.");
        setActiveStep(2);
      }
    })
    .catch(err => setErrorMessage(err));
  }

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
                  balance={balance}
                  numOutputs={numOutputs}
                  transactionFees={transactionFees} 
                  onNumOutputsChange={onNumOutputsChange}
                  onTransactionFeesChange={onTransactionFeesChange}/>
              }
              {index===2 &&
                <OutputDetails numOutputs={numOutputs} 
                  outputDetails={outputDetails} setOutputDetails={setOutputDetails}/>
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
          <Button onClick={handleReset} className={classes.button}>
            Make another transaction
          </Button>
        </Paper>
      )}
    </div>
  );
}
