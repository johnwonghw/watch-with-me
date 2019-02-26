import React, { Component } from 'react';
import _helper from 'utils/helper';
import { Link } from "react-router-dom";

import './_front-page.scss';

class FrontPage extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {

  }
  // onClick={() => {
  //   console.log(_helper.generateId())
  // }}


  render() {
    return (
      <div className="front-page-container">
        <div>hello lets start watchin stuff</div>
        <Link to={`/room/${_helper.generateId()}`}>click me to start a room!</Link>
      </div>
    );
  }
}

export default FrontPage;
