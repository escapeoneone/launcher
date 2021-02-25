import React from 'react';
import Head from 'next/head';
import {Layout} from 'antd';
import {join} from "path";
import { Client, Authenticator, ILauncherOptions } from 'minecraft-launcher-core';
import ServerCard from "../components/Server";
import 'antd/dist/antd.css';
import os from "os";
import fs from "fs";
import child_process from 'child_process';
import simpleGit from 'simple-git';

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
  runClient(server, path, config){
    const launcher = new Client();

    let opts = {
        // For production launchers, I recommend not passing 
        // the getAuth function through the authorization field and instead
        // handling authentication outside before you initialize
        // MCLC so you can handle auth based errors and validation!
        authorization: Authenticator.getAuth(this.username, undefined),
        root: path,
        version: {
            number: config.version,
            type: "Kreocraft " + server.title.toUpperCase()
        },
        forge: config.forge ? join(path, config.forge) : undefined,
        //forge: join(path, "forge-1.12.2-14.23.5.2855.jar"), 
        memory: {
            max: "4G",
            min: "2G"
        },
    }

    launcher.launch(opts);

    launcher.on('debug', (e) => {
        console.log("DEBUG: " + e);
        if(e.startsWith("[MCLC]: Launching with arguments")){
            this.startButton.setEnabled(true);
            this.servers.setEnabled(true);
            this.status.setText("Запущенно");
        }
    });
    launcher.on('data', (e) => console.log(e));
}
  async play(server) {
    let ClientPath = join(LauncherPath, server.title);

    let url = `${server.git.replace("https://github.com", "https://raw.githubusercontent.com")}/main/config.json`;

    let config = await fetch(url);
    config = await config.json();

    console.log("Starting " + server.title + "...");
    if(!fs.existsSync(ClientPath)) await git.clone(server.git, ClientPath);
    

    this.runClient(server, ClientPath, config);
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
          git="https://github.com/kreogon-official/magictech-kreocraft" />
      </Content>
    </>
  }
}

export default Home;