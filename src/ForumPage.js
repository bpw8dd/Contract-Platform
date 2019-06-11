import React from "react";
import ForumComment from "./ForumComment.js";
import ForumPost from "./ForumPost.js";
import { Button, Input } from "antd";
import "./ForumPage.css";
import { FormHelperText } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import firebaseApp from "./firebaseConfig";
import StudentNavbar from "./StudentNavbar.js";
import HeaderLogo from "./HeaderLogo.png";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));

const { TextArea } = Input;
export default class ForumPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      details: "",
      posts: [],
      currentUser: null,
      postId: ""
    };

    this.createInDatabase = this.createInDatabase.bind(this);
  }

  createPost = event => {
    this.createInDatabase().then(() => {
      console.log("it worked");
      var newArray = this.state.posts.slice();
      newArray.push({
        post: (
          <ForumPost
            title={this.state.title}
            details={this.state.details}
            currentUser={this.state.currentUser}
            postId={this.state.postId}
          />
        ),
        // Pass postId as a prop to ForumComment
        comments: <ForumComment 
                  currentUser={this.state.currentUser}
                  postId={this.state.postId} />
      });
      this.setState({
        posts: newArray,
        // postId: this.state.postId + 1
      });  
    }
    ) // retrieve unique postId here by calling Object.keys()
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  mapPosts = () => {
    let posts = this.state.posts;
    console.log(posts);
    return posts.map(item => {
      return (
        <div style={{
            borderStyle: "solid"
        }}>
            <Grid item xs={6}>
                {item.post}
                {item.comments}
            </Grid>
        </div>  
      );
    });
  };

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
          currentUser: Object.keys(value[uid]).map(key => value[uid][key])
        },
        () => {
          resolve();
        }
      );
    });
  };

  async createInDatabase() {
    let currentTime = new Date().toLocaleString();
    const postsRef = firebaseApp
      .database()
      .ref("posts");
    const post = {
      author: this.state.currentUser[0].username,
      title: this.state.title,
      details: this.state.details,
      timestamp: currentTime,
      // postId: this.state.postId,
      comments: [],
    };
    
    let postId = await postsRef.push(post).key;
    console.log(postId);
    this.setState({
      postId: postId
    })
  };


  render() {
    //   const classes = useStyles();
    return (
      <div className="container">
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
        {/* <Grid item xs ={12}> */}
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Developer Forum
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Learn, share, and build with other developers in the RevTek
          community!. Give back some knowledge to others and share a post today.
        </Typography>
        {/* </Grid> */}
        <div className="postBar">
            <div>
            <Input
                name="title"
                placeholder="Title of Post"
                value={this.state.title}
                onChange={this.handleChange}
            />
            </div>
            <div>
            <TextArea
                name="details"
                placeholder="Post details..."
                value={this.state.details}
                onChange={this.handleChange}
                rows={4}
            />
            </div>
            </div>
            <div>
            <Button onClick={this.createPost}>Create Post</Button>
            </div>
        <br />
        <br />
        <div className="postHistory">
        {/* <Grid 
        alignContent={"space between"}
        container spacing={3}> */}
          {this.state.posts.length && this.mapPosts()}
        {/* </Grid> */}
        </div>
      </div>
    );
  }
}
