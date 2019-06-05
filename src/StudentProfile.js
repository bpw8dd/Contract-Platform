import React from "react";
import StudentNavbar from "./StudentNavbar.js";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { withStyles } from "@material-ui/core/styles";
import HeaderLogo from "./HeaderLogo.png";
import firebaseApp from "./firebaseConfig.js";
import { Avatar } from "antd";

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Built with love by the "}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI
      </Link>
      {" team."}
    </Typography>
  );
}

const useStyles = theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  }
});

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

class StudentProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      uid: ""
    };
  }

  componentDidMount() {
    const usersRef = firebaseApp.database().ref("users");

    usersRef.on("value", snap => {
      let update = snap.val() || [];
      this.updateSnap(update);
    });
  }

  updateSnap = value => {
    return new Promise(resolve => {
      const { uid } = firebaseApp.auth().currentUser;
      this.setState(
        {
          users: value,
          currentUser: Object.keys(value[uid]).map(key => value[uid][key])[0],
          uid: uid
        },
        () => {
          resolve();
        }
      );
    });
  };

  render() {
    const { users } = this.state;
    const { uid } = this.state.uid;
    const { currentUser } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <React.Fragment>
          <CssBaseline />

          <AppBar position="relative">
            <Toolbar>
              <img src={HeaderLogo} height="80" alt="Logo" />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  float: "right",
                  textAlign: "right",
                  display: "inline - block",
                  width: "98%",
                  padding: "10px",
                  justifyContent: "space-between"
                }}
              >
                <StudentNavbar />
              </div>
            </Toolbar>
          </AppBar>

          <main>
            {/* Hero unit */}
            <div className={classes.heroContent}>
              <Container maxWidth="sm">
                <Typography
                  component="h1"
                  variant="h2"
                  align="center"
                  color="textPrimary"
                  gutterBottom
                >
                  {firebaseApp.auth().currentUser.displayName}
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  color="textSecondary"
                  paragraph
                />
                <Avatar
                  size={64}
                  src={firebaseApp.auth().currentUser.photoURL}
                />
                <div className={classes.heroButtons}>
                  <Grid container spacing={2} justify="center">
                    <Grid item>
                      <a href={currentUser ? currentUser.linkedIn : ""}>
                        <Button variant="contained" color="primary">
                          Linked In
                        </Button>
                      </a>
                    </Grid>
                    <Grid item>
                      <a href={currentUser ? currentUser.github : ""}>
                        <Button variant="outlined" color="primary">
                          GitHub
                        </Button>
                      </a>
                    </Grid>
                  </Grid>
                </div>
              </Container>
            </div>

            <Container className={classes.cardGrid} maxWidth="md">
              {/* End hero unit */}
              <b>Current Contracts</b>
              <Grid container spacing={4}>
                {currentUser
                  ? currentUser.currentContracts.map(contract => (
                      <Grid item key={contract} xs={12} sm={6} md={4}>
                        <Card className={classes.card}>
                          {/* <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                  /> */}
                          <CardContent className={classes.cardContent}>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              {contract.title}
                            </Typography>
                            <Typography>{contract.description}</Typography>
                          </CardContent>
                          <CardActions>
                            <Button size="small" color="primary">
                              View
                            </Button>
                            {/* <Button size="small" color="primary">
                      Edit
                    </Button> */}
                          </CardActions>
                        </Card>
                      </Grid>
                    ))
                  : ""}
              </Grid>

              <b>Past Contracts</b>
              <Grid container spacing={4}>
                {currentUser
                  ? currentUser.pastContracts.map(contract => (
                      <Grid item key={contract} xs={12} sm={6} md={4}>
                        <Card className={classes.card}>
                          {/* <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                  /> */}
                          <CardContent className={classes.cardContent}>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              {contract.title}
                            </Typography>
                            <Typography>{contract.description}</Typography>
                          </CardContent>
                          <CardActions>
                            <Button size="small" color="primary">
                              View
                            </Button>
                            {/* <Button size="small" color="primary">
                      Edit
                    </Button> */}
                          </CardActions>
                        </Card>
                      </Grid>
                    ))
                  : ""}
              </Grid>
            </Container>
          </main>
          {/* Footer */}
          <footer className={classes.footer}>
            <Typography variant="h6" align="center" gutterBottom>
              Footer
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              color="textSecondary"
              component="p"
            >
              Something here to give the footer a purpose!
            </Typography>
            <MadeWithLove />
          </footer>
          {/* End footer */}
        </React.Fragment>
      </div>
    );
  }
}

export default withStyles(useStyles)(StudentProfile);
