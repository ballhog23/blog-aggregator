import fs from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string,
    currentUserName: string,
}

export function setUser(userName: string) {
    const base = readBaseConfig();
    writeConfig({ dbUrl: base.dbUrl, currentUserName: userName });
}

function validateConfig(rawConfig: any): Config {
    if (!rawConfig.db_url || typeof rawConfig.db_url !== 'string') {
        throw new Error('db_url is required in config file')
    }

    if (!rawConfig.current_user_name || typeof rawConfig.current_user_name !== 'string') {
        throw new Error('current_user_name is required in config file');
    }

    const config: Config = {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name,
    };

    return config;
}

export function readConfig() {
    const configFilePath = getConfigFilePath();

    const data = fs.readFileSync(configFilePath, 'utf-8');
    const rawConfig = JSON.parse(data);

    return validateConfig(rawConfig);
}

function readBaseConfig() {
    const fullPath = getConfigFilePath();
    const rawBaseConfig = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

    if (!rawBaseConfig.db_url || typeof rawBaseConfig.db_url !== 'string') {
        throw new Error('db_url needs to be set in the base config file');
    }

    return { dbUrl: rawBaseConfig.db_url };
}

function getConfigFilePath() {
    const configFileName = '.gatorconfig.json';
    const homeDir = os.homedir();
    return path.join(homeDir, configFileName);
}

function writeConfig(config: Config) {
    const fullPath = getConfigFilePath();

    const rawConfig = {
        db_url: config.dbUrl,
        current_user_name: config.currentUserName
    }

    const data = JSON.stringify(rawConfig, null, 2);
    fs.writeFileSync(fullPath, data, 'utf-8');
}