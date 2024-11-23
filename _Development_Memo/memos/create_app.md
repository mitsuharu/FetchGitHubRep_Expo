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

