import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Layout,
  Form,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  Slider,
  Button,
  Input
} from 'antd';

import 'antd/dist/antd.css';

let authS = "http://localhost:3000/getUserInfo"; 

const {
  Header,
  Content,
} = Layout;
const { Item: FormItem } = Form;
const { Option } = Select;

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      token: "",
      progress: false
    };

    //this.login()
  }
  login(){
    //META
    let token = this.state.token;

    //CODE
    this.setState({progress: true})
    console.log("loginng..")
    let response = fetch(authS, {method: "GET", headers: {
      "kreo_token": token
    }}).then((response) => {
      response.json().then((json) => {
        localStorage.setItem("login", JSON.stringify(json));
        window.location.pathname = "/play";
      })
    });
  }
  render() {
    return <>
      <Head>
        <title>Login | KreoCraft</title>
      </Head>

      <Content style={{ padding: 48 }}>
        <h1>KreoCraft Launcher</h1>
        <Input.Password placeholder={"Token"} onChange={(e) => {
          this.setState({token: e.target.value});
        }}></Input.Password>
        <Button loading={this.state.progress} style={{marginTop: "10px"}} onClick={this.login.bind(this)}>Sign in</Button>
      </Content>
    </>
  }
}

export default Home;