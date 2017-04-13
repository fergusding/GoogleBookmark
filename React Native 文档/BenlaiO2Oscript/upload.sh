#!/usr/bin/expect -f


#--------------------------------------------
# 功能：先在服务器指定路径下新建文件夹，并将脚本所在路径下所有文件通过sftp协议上传到该文件夹中。
# 使用说明：命令有5个参数。注意：目前该脚本无参数验证功能，必须5个参数，否则脚本运行结果会发生错误
#			参数1：上传文件的文件夹路径名*；
#			参数2：服务器地址
#			参数3：sftp用户名
#			参数4：sftp密码
#			参数5：sftp工作路径
# 作者：ccf
# E-mail:ccf.developer@gmail.com
# 创建日期：2013/02/17
#--------------------------------------------


#参数设置
set directory [lindex $argv 0]
set host [lindex $argv 1]
set username [lindex $argv 2]
set password [lindex $argv 3]
set hostfilepath [lindex $argv 4]


cd $directory

set timeout 120

#sftp连接
spawn sftp $username@$host

#第一次sftp时需输入yes
#expect {
#    "(yes/no)?" {send "yes\r"; exp_continue}
#    "password:" {send "$password\r"; exp_continue}
#}

#切换到所要放置的目录下
expect "sftp>"
send "cd $hostfilepath\r"


#上传
foreach filepath [glob *] {
	expect "sftp>"
	send "put $filepath\r"
}

#退出sftp
expect "sftp>"
send "bye\r"

expect eof
