import React, { Component } from "react";
import Tree from "react-d3-tree";
import { connect } from "react-redux";
import { makeTree } from "../../actions/productsActions";
import { Typography } from "@material-ui/core";
import Loading from "../Loading";

const svg = {
  shape: "circle",
  shapeProps: {
    r: 10,
    fill: "#0b5b3b"
  }
};

/*const myTreeData = [
  {
    name: "Top Level",
    attributes: {
      keyA: "val A",
      keyB: "val B",
      keyC: "val C"
    },
    children: [
      {
        name: "Level 2: A",
        attributes: {
          keyA: "val A",
          keyB: "val B",
          keyC: "val C"
        },
        children: [
          {
            name: "Level 3: A",
            attributes: {
              keyA: "val A",
              keyB: "val B",
              keyC: "val C"
            }
          }
        ]
      },
      {
        name: "Level 2: B"
      }
    ]
  }
];*/

const containerStyles = {
  width: "100%",
  height: "100vh"
};

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: []
    };
  }

  componentWillMount() {
    const { id } = this.props.match.params;

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

  render() {
    const { id } = this.props.match.params;
    if (this.state.treeData.length > 0) {
      return (
        <div style={containerStyles} ref={tc => (this.treeContainer = tc)}>
          <div className="row justify-content-center">
            <div className="col-4">
              <Typography variant="h5" gutterBottom>
                Product Traceability
              </Typography>
            </div>
            <div />
          </div>
          <Tree
            data={this.state.treeData}
            translate={this.state.translate}
            orientation={"vertical"}
            nodeSvgShape={svg}
            pathFunc={"straight"}
            nodeSize={{ x: 175, y: 140 }}
          />
        </div>
      );
    } else {
      return <Loading className={"mb-5"} />;
    }
  }
}

const mapStateToProps = state => ({
  tree: state.products.tree
});

export default connect(
  mapStateToProps,
  { makeTree }
)(ProductDetails);
