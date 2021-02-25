import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    Layout,
    Form,
    Select,
    Button
} from 'antd';

import { Skeleton, Switch, Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';

const util = require('minecraft-server-util');


let authS = "http://localhost:3000/getUserInfo";

const { Meta } = Card;

const {
    Header,
    Content,
} = Layout;
const { Item: FormItem } = Form;
const { Option } = Select;

class Server extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: true,
            playButtonProgress: false,
            progressError: false,
            serverData: {
                url: this.props.url,
                description: this.props.description,
                title: this.props.title,
                version: this.props.version,
                git: this.props.git
            },
            onPlay: this.props.onClickPlay,
            players: { avaible: 0, online: 0 }
        };

        setInterval(this.fetch.bind(this), 5000);

        this.fetch();
    }
    fetch() {
        this.setState({
            progress: true
        });
        util.status(this.state.serverData.url)
            .then((response) => {
                this.setState({
                    players: {
                        online: response.onlinePlayers,
                        avaible: response.maxPlayers
                    },
                    progress: false,
                    favicon: response.favicon,
                    version: response.version
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ progressError: true });
            });
    }
    render() {
        return <>
            <Card loading={this.state.progress} style={{ width: 300, marginTop: 16 }} loading={this.state.progress} actions={!this.state.progress ? [
                <Button loading={this.state.playButtonProgress} onClick={() => {
                    if(typeof this.state.onPlay == "function"){
                        this.setState({playButtonProgress: true});
                        this.state.onPlay(this.state.serverData).then(() => {
                            this.setState({playButtonProgress: false});
                        })
                    }
                }}>Запустить</Button>,
                <Button>Подробнее</Button>
            ] : [
                    <span style={{ color: this.state.progressError ? "red" : "grey" }}> {this.state.progressError ? "Произошла ошибка, повторите позже" : "Получение мета-данных..."}</span>
                ]}
            >
                <Meta
                    avatar={
                        <Avatar src={this.state.favicon} />
                    }
                    title={<>
                        {this.state.serverData.title}<br />
                        <span style={{ color: "grey" }}>
                            {this.state.players.online} / {this.state.players.avaible}
                        </span><br />
                        <span style={{ color: "grey" }}>
                            Версия: {this.state.serverData.version}
                        </span>
                    </>}
                    description={this.state.serverData.description}
                />
            </Card>
        </>
    }
}

export default Server;