import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import GenerateDownloadableKeys from '../utils/Keys';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function CreateAccount(props) {
  const classes = useStyles();

  const [generatedKeys, setGeneratedKeys] = React.useState(null);

  const onCreateClick = () => {
    GenerateDownloadableKeys()
    .then(keys => setGeneratedKeys(keys))
    .catch(err => console.log(err));
  }

  const dispatchTextAsFile = (filename, text) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const downloadPublicKey = () => {
    dispatchTextAsFile("public.pem", generatedKeys.publicKey);
  }

  const downloadPrivateKey = () => {
    dispatchTextAsFile("private.pem", generatedKeys.privateKey);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid container justify="center" direction="row">
          {generatedKeys
            ? <Grid container justify="center" direction="row">
                <Button type="button" variant="contained" color="primary" onClick={downloadPublicKey} className={classes.button}>
                  Download Public Key
                </Button>
                <Button type="button" variant="contained" color="primary" onClick={downloadPrivateKey} className={classes.button}>
                  Download Private Key
                </Button>
              </Grid>
            : <Button type="button" variant="contained" color="primary" onClick={onCreateClick} className={classes.button}>
                Create an Account
              </Button>
          }
        </Grid>
      </div>
    </Container>
  );
}
