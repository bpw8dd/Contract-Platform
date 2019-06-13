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
import { Redirect } from "react-router-dom";

// formatting for cards from material UI
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

// formatting for cards from material UI
const useStyles = theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0.5, 6)
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
    padding: "20px",
    marginTop: "50px"
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

const cards = [1, 2, 3, 4];

var names = [];

var information = [];

var stateNames = [];

var stateInformation = [];

class StudentProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      uid: "",
      all_contracts: []
    };
  }

  componentDidMount() {
    const usersRef = firebaseApp.database().ref(`students`);
    usersRef.on("value", snap => {
      let update = snap.val() || [];
      this.updateSnap(update);
    });

    const contractsRef = firebaseApp.database().ref(`contracts`);
    contractsRef.on("value", snap => {
      let contracts = snap.val() || [];
      this.updateContract(contracts);
    });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
  };

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  updateSnap = value => {
    return new Promise(resolve => {
      if (firebaseApp.auth().currentUser) {
        const { uid } = firebaseApp.auth().currentUser;

        let currentUser = "";
        for (let user in value) {
          console.log(value[user].uid);
          if (value[user].uid === uid) {
            currentUser = value[user];
          }
        }

        this.setState(
          {
            users: value,
            currentUser: currentUser,
            uid: uid
          },
          () => {
            resolve();
          }
        );
      }
    });
  };

  updateContract = contracts => {
    return new Promise(resolve => {
      let all_contracts = [];

      for (let contract in contracts) {
        all_contracts.push(contracts[contract]);
      }
      this.setState(
        {
          all_contracts: all_contracts
        },
        () => {
          resolve();
        }
      );
    });
  };

  render() {
    console.log(this.state.titles);
    const { users } = this.state;
    const { uid } = this.state.uid;
    const { currentUser } = this.state;
    const { classes } = this.props;

    return (
      <div marginRight="0px">
        {this.renderRedirect()}
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
                <StudentNavbar titles={names} details={information} />
              </div>
            </Toolbar>
          </AppBar>

          <main>
            {/* Hero unit */}
            <div className={classes.heroContent}>
              <Grid container spacing={2}>
                <Grid item xs={3} style={{ display: "flex-start" }}>
                  <Typography
                    component="h1"
                    variant="h2"
                    color="textPrimary"
                    x
                    gutterBottom
                  >
                    {firebaseApp.auth().currentUser
                      ? firebaseApp.auth().currentUser.displayName
                      : this.setRedirect()}
                  </Typography>
                  <Typography
                    variant="h5"
                    align="center"
                    color="textSecondary"
                    paragraph
                  />
                  <Avatar
                    size={192}
                    src={
                      firebaseApp.auth().currentUser
                        ? firebaseApp.auth().currentUser.photoURL
                        : this.setRedirect()
                    }
                  />
                  <div style={{ justifyContent: "space-between" }}>
                    <a
                      target="_blank"
                      href={currentUser ? currentUser.linkedIn : ""}
                      padding="50px"
                    >
                      <Button variant="contained" color="primary">
                        Linked In
                      </Button>
                    </a>
                    <a
                      target="_blank"
                      href={currentUser ? currentUser.github : ""}
                    >
                      <Button variant="outlined" color="primary">
                        GitHub
                      </Button>
                    </a>
                  </div>
                </Grid>
                <Grid item xs={9} style={{ display: "flex-start" }}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        component="h1"
                        variant="h4"
                        align="center"
                        marginRight="0px"
                        color="textPrimary"
                        x
                        gutterBottom
                      >
                        Current Contracts
                      </Typography>
                      <div align="center" display="flex-start">
                        {this.state.all_contracts.map((card, index) => (
                          <Grid
                            item
                            key={index}
                            xs={12}
                            sm={6}
                            md={12}
                            align="center"
                          >
                            <Card className={classes.card}>
                              <CardContent className={classes.cardContent}>
                                <Typography
                                  gutterBottom
                                  variant="h5"
                                  component="h2"
                                >
                                  {card.title}
                                </Typography>
                                <Typography>{card.details}</Typography>
                              </CardContent>
                              <CardActions
                                style={{
                                  display: "center",
                                  justifyItems: "center",
                                  marginTop: "20px"
                                }}
                              >
                                <Button size="small" color="primary">
                                  View
                                </Button>
                              </CardActions>
                            </Card>
                          </Grid>
                        ))}
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        component="h1"
                        variant="h4"
                        align="center"
                        marginRight="0px"
                        color="textPrimary"
                        x
                        gutterBottom
                      >
                        Past Contracts
                      </Typography>
                      <div align="center" display="flex-start">
                        {this.state.all_contracts.map(card => (
                          <Grid
                            item
                            key={card}
                            xs={12}
                            sm={6}
                            md={12}
                            align="center"
                          >
                            <Card className={classes.card}>
                              <CardContent className={classes.cardContent}>
                                <Typography
                                  gutterBottom
                                  variant="h5"
                                  component="h2"
                                >
                                  {card.title}
                                </Typography>
                                <Typography>{card.details}</Typography>
                              </CardContent>
                              <CardActions
                                style={{
                                  display: "center",
                                  justifyItems: "center",
                                  marginTop: "20px"
                                }}
                              >
                                <Button size="small" color="primary">
                                  View
                                </Button>
                              </CardActions>
                            </Card>
                          </Grid>
                        ))}
                      </div>
                    </Grid>
                  </Grid>
                  {/* <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    marginRight="0px"
                    color="textPrimary"
                    x
                    gutterBottom
                  >
                    Contracts
                  </Typography>
                  <div align="center" display="flex-start">
                    {cards.map(card => (
                      <Grid
                        item
                        key={card}
                        xs={12}
                        sm={6}
                        md={8}
                        align="center"
                      >
                        <Card className={classes.card}>
                          <CardContent className={classes.cardContent}>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              Contract Name
                            </Typography>
                            <Typography>Contract Details</Typography>
                          </CardContent>
                          <CardActions
                            style={{
                              display: "center",
                              justifyItems: "center",
                              marginTop: "20px"
                            }}
                          >
                            <Button size="small" color="primary">
                              View
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </div> */}
                </Grid>
              </Grid>
              <Container maxWidth="sm">
                <div className={classes.heroButtons}>
                  <Grid container spacing={2} justify="center">
                    <Grid item />
                    <Grid item />
                  </Grid>
                </div>
              </Container>
            </div>
          </main>
          {/* Footer */}
          <footer className={classes.footer}>
            <Typography variant="h8" align="center" gutterBottom>
              © Copyright 2019 | RevTech | All Rights Reserved | Privacy Policy
              | Terms and Conditions
            </Typography>
          </footer>
          {/* End footer */}
        </React.Fragment>
      </div>
    );
  }
}

export default withStyles(useStyles)(StudentProfile);
