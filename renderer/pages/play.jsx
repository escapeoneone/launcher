import React from 'react';
import Head from 'next/head';
import {Layout} from 'antd';

import {join} from "path";

import ServerCard from "../components/Server";

import 'antd/dist/antd.css';

import os from "os";

const fs = require('fs');
const child_process = require('child_process');

var rimraf = require("rimraf");

const simpleGit = require('simple-git');
const git = simpleGit();

const {
  Content,
} = Layout;

let LauncherPath = join(os.homedir(), "kreocraftLauncher");

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      progress: false
    };

    //this.login()
  }
  async play(server) {
    let ClientPath = join(LauncherPath, server.title);

    console.log("Starting " + server.title + "...");
    if(!fs.existsSync(ClientPath)) await git.clone(server.git, ClientPath);

    
  }
  render() {
    return <>
      <Head>
        <title>Select server | Kreocraft</title>
      </Head>

      <Content style={{ padding: 48 }}>
        <h1>KreoCraft Servers</h1>
        <ServerCard
          version={"1.12.2"}
          title={"MagicTech"}
          description={"Смесь магии и технологий"}
          url={"mc.hypixel.net"}
          onClickPlay={this.play.bind(this)}
          git="https://github.com/kreogon-official/magictech-kreocraft.git" />
      </Content>
    </>
  }
}

export default Home;