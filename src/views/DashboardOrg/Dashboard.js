import prods from "../../assets/products.png";
import activities from "../../assets/activities.png";
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import Paper from "@material-ui/core/Paper";

const data = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  datasets: [
    {
      label: "Cerveja (CO2eq)",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "#0b5b3b",
      borderColor: "#0b5b3b",
      data: [
        77.157,
        18.104,
        18.949,
        1.128,
        68.863,
        16.926,
        86.068,
        8.074,
        97.603,
        37.752,
        46.656,
        41.965
      ]
    },
    {
      label: "Iogurte chocolate (CO2eq)",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "#2ecc71",
      borderColor: "#2ecc71",
      data: [
        22.239,
        71.104,
        24.135,
        9.163,
        28.223,
        14.508,
        5.155,
        63.985,
        25.665,
        93.671,
        79.22,
        19.774
      ]
    },
    {
      label: "Leite chocolatado (CO2eq)",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "#26c281",
      borderColor: "#26c281",
      data: [
        83.918,
        52.163,
        24.208,
        28.92,
        30.483,
        42.594,
        67.466,
        99.638,
        29.556,
        58.619,
        94.818,
        34.131
      ]
    }
  ]
};

const styles = theme => ({
  card: {
    display: "flex",
    position: "relative"
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    position: "absolute",
    width: 151,
    right: 0,
    top: 0,
    bottom: 0
  },
  button: {
    margin: theme.spacing(1)
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  playIcon: {
    height: 38,
    width: 38
  },
  root: {
    padding: theme.spacing(3, 2)
  }
});

function MediaControlCard(props) {
  const { classes, theme } = props;

  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-6">
          <Card className={classes.card}>
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                  Products
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  120 registred
                </Typography>
              </CardContent>
              <div className={classes.controls}>
                <Button
                  color="primary"
                  className={classes.button}
                  href="#/company/products"
                >
                  Details
                </Button>
              </div>
            </div>
            <CardMedia
              className={classes.cover}
              image={prods}
              title="Products"
            />
          </Card>
        </div>
        <div className="col-6">
          <Card className={classes.card}>
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                  Monthly Activities
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  120 registred
                </Typography>
              </CardContent>
              <div className={classes.controls}>
                <Button
                  color="primary"
                  className={classes.button}
                  href="#/company/monthlyactivites"
                >
                  Details
                </Button>
              </div>
            </div>
            <CardMedia
              className={classes.cover}
              image={activities}
              title="Monthly activities"
            />
          </Card>
        </div>
      </div>
      <div className="row justify-content-center mt-3 mb-3">
        <div className="col-12">
          <Paper className={classes.root}>
            <Line
              data={data}
              height={150}
              options={{
                title: {
                  display: true,
                  text: "Product FootPrints"
                },
                legend: {
                  display: true,
                  position: "top"
                }
              }}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
}

MediaControlCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(MediaControlCard);
