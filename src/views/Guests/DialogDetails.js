import React from "react";
import Tree from "react-d3-tree";
import { connect } from "react-redux";
import { makeTree } from "../../actions/productsActions";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import SvgIcon from "@material-ui/core/SvgIcon";
import TextField from "@material-ui/core/TextField";
import Loading from "../Loading";

const svg = {
  shape: "circle",
  shapeProps: {
    r: 10,
    fill: "#0b5b3b"
  }
};

const styles = {
  avatar: {
    margin: 10
  },
  addAvatar: {
    margin: 10,
    color: "#fff",
    backgroundColor: "#0b5b3b"
  }
};

const containerStyles = {
  width: "100%",
  height: "100vh"
};

class DynamicDialog extends React.Component {
  state = {
    treeData: []
  };

  componentWillMount() {
    const { id } = this.props;
    console.log(id);
    if (id.length != 0) {
      this.props.makeTree(id).then(response => {
        if (response) {
          var arr = [];
          arr.push(this.props.tree.data);
          this.setState({ treeData: arr }, () => {
            const dimensions = this.treeContainer.getBoundingClientRect();
            this.setState({
              translate: {
                x: dimensions.width / 2,
                y: dimensions.height / 2
              }
            });
          });
        }
      });
    }
  }

  handleCancel = () => {
    this.props.onClose();
  };

  render() {
    const { id, ...other } = this.props;

    return (
      <div>
        <Dialog
          onClose={this.handleCancel}
          aria-labelledby="simple-dialog-title"
          fullWidth={true}
          scroll="paper"
          maxWidth="sm"
          {...other}
        >
          <DialogTitle
            id="scroll-dialog-title"
            style={{ backgroundColor: "#0b5b3b", color: "#fff" }}
          >
            <SvgIcon
              fontSize="small"
              viewBox="0 0 42 42"
              style={{ fontSize: "1.2rem", marginRight: "5px" }}
            >
              <path
                d="M37.059,16H26V4.941C26,2.224,23.718,0,21,0s-5,2.224-5,4.941V16H4.941C2.224,16,0,18.282,0,21s2.224,5,4.941,5H16v11.059
	            C16,39.776,18.282,42,21,42s5-2.224,5-4.941V26h11.059C39.776,26,42,23.718,42,21S39.776,16,37.059,16z"
              />
            </SvgIcon>
            Product Traceability
          </DialogTitle>

          <DialogContent>
            {this.state.treeData.length > 0 ? (
              <div
                style={containerStyles}
                ref={tc => (this.treeContainer = tc)}
              >
                <Tree
                  data={this.state.treeData}
                  translate={this.state.translate}
                  orientation={"vertical"}
                  nodeSvgShape={svg}
                  pathFunc={"straight"}
                  nodeSize={{ x: 175, y: 140 }}
                />
              </div>
            ) : (
              <Loading className={"mb-5"} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tree: state.products.tree
});

export default connect(
  mapStateToProps,
  { makeTree }
)(DynamicDialog);
