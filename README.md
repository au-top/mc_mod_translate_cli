# MC Mod Translate

支持直接翻译 `Jar` 或者翻译 `JSON`

提供一个友好的 CLI 工具

默认使用`百度翻译API`但是便于自行开发扩展其他翻译Api 

使用 `MIT` 许可证

## Dependent

nodejs v16.15.1  or upper version

## Make

```
npm run init

npm run make
```

## Use


### From project call script

```
npm run run -- -t ./mod.jar -o ./mod_zh_cn.jar -c ./config.yaml
```


### Install to os and from global call command

install to os global env

```
npm install -g 
```

from global call script


### transform jar (Recommended)


```
mc_mod_translate -t ./mod.jar -o ./mod_zh_cn.jar -c ./config.yaml
```
or
```
mc_mod_translate -t ./mod.jar -o ./mod_zh_cn.jar -c ./config.yaml --jar
```


### transform json

```
mc_mod_translate -t ./en_us.json -o ./zh_cn.json -c ./config.yaml --json
```


### Script help

```
mc_mod_translate --help
```
or
```
npm run run -- --help
```


## Config 

### Config you baidu translate api

from project root copy `config.yaml.example` to `config.yaml`

use script `-c` or `--config` set path to `config.yaml`

example command
```
mc_mod_translate -t ./mod.jar -o ./mod_zh_cn.jar -c c:/config.yaml
```
or
```
mc_mod_translate -t ./mod.jar -o ./mod_zh_cn.jar --config c:/config.yaml
```


## Dev 

### New Translate Api

see `src/api/baidu-translate.ts` 

### New Data Source

see `src/api/mod-analyser` 



