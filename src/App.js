import React, { Component } from "react";
import "./App.css";

import axios, { post } from "axios";
import FileDownload from "js-file-download";

class SectionCreate extends React.Component {
  constructor() {
    super();
    this.state = {
      file: null
    };

    // this.handleClick = this.handleClick.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  onFormSubmit(e) {
    e.preventDefault(); // Stop form submit
    this.fileUpload();
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  fileUpload() {
    const bodyFormData = new FormData();
    bodyFormData.append("file", this.state.file);

    return axios({
      method: "post",
      url: "http://localhost:3001/upload",
      data: bodyFormData,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(function(response) {
        this.setState({ file: null });
      })
      .catch(function(response) {
        console.log(response);
      });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onFormSubmit}>
          <h1>File Upload</h1>
          <input type="file" onChange={this.onChange} />
          <button type="submit">Upload</button>
        </form>
        <div className="button__container">
          <button className="button" onClick={""}>
            Download
          </button>
        </div>
      </div>
    );
  }
}

class Download extends React.Component {
  render() {
    return (
      <div className="button__container">
        <a className="button" href={this.props.url}>
          {" "}
          {this.props.fileName}{" "}
        </a>
      </div>
    );
  }
}

Download.defaultProps = {
  url: "https://eqofileserver.sfo2.digitaloceanspaces.com/michal-logo.png",
  fileName: "michal.png"
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <SectionCreate />
        </header>
      </div>
    );
  }
}

export default App;
