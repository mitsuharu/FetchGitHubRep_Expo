# 環境作成

## アプリを作る

```shell
% npx create-expo-app@latest
```

## Yarn v4

Yarn V4 を利用する

```shell
% yarn set version stable
```

ファイル `.yarnrc.yml` を作成する

```yml:.yarnrc.yml
nodeLinker: node-modules
```

ファイル `.gitignore` に次を追加する

```.gitignore
# Yarn v4
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
```

`package.json` に `eas-build-pre-install` を追加して、Yarn v4 に対応する。デフォルトは v1 なため。

```json:package.json
{
  "scripts": {
    "eas-build-pre-install": "corepack enable && yarn set version 4"
  }
}
```

https://docs.expo.dev/more/create-expo/#yarn-2-modern
