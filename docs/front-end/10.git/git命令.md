# git 命令

## 跳过检查

```shell
git commit --no-verify -m"msg"
```

## git remote

查看链接的远程分支，origin 即是远程的 master 分支

## git branch

列出本地分支

## git branch -a （git branch --all 的缩写）

列出所有分支，包括本地和远程分支

## git checkout -b 本地分支名称（比如:dev） 远程分支名称（比如:origin/dev）

作用是远程分支切换到 origin/dev，并在本地创建 dev 分支，并切换到的本地 dev 分支
例子：git checkout -b dev origin/dev

## create a new repository on the command line

```shell
echo "# test" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/yourgithubname/xxx.git(仓库地址)
git push -u origin master
```

### git push -u origin branchname

可以把本地的当前分支 push 到远程仓库的 branchname 分支，如果没有 branchname 分支则会自动新建一个远程分支 branchname，并 push

### push an existing repository from the command line

```shell
git remote add origin https://github.com/yourgithubname/xxx.git(仓库地址)
git push -u origin master
```
