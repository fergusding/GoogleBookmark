#!/bin/bash
#--------------------------------------------
# 举例：
# dailyScript.sh -r branch -p 7001
# dailyScript.sh -r trunk -p benlai
#
# 参数说明：
# -r NAME  表示打branch还是trunk，不传则打所有
# -p NAME  表示打哪个接口，目前支持7001，8001，9001，benlai
# -t NAME  表示是否显示trunk和branch标示符
#
#
#
#
#
# 1. 拿到打版本的参数
# 2. svn revert 本地版本
# 3. svn update 本地版本
# 4. 拿到打包文件路径，修改API，打包
# 5. 上传
# 6. 服务器更新html
#
#
#
#
#
#
#
#
#
#
#--------------------------------------------


#--------------------------------------------
# 配置信息
repositoryPath="/Users/benlai/Desktop/Benlai.O2O.iOS/"
# "trunk"  branch tag
arrayRep=( "branch")
# "trunk/Trunk2016/" "branches/Branch2.2.3/" "tags/tag2.2.2/" "branches/Branch2.2.5/"
arrayPath=( "branches/branch1.0.0/")
# "testapi01qa.benlai.com" "api01shqa.benlai.com" "api02shqa.benlai.com"
# "192.168.60.88:13996" "192.168.60.33:13996" "api.o2o.benlai.com" "apiO2O.benlai.com"
arrayAPI=( "192.168.60.33:13996" "192.168.60.88:13996" "api.o2o.benlai.com" "apiO2O.benlai.com")
apiPath="BenlaiO2O/Define/UrlDefinition.h"
domainTest="192.168.60.210"
domainFormal="www.benlai.com"

publish_domain="192.168.60.225"
sftp_username=root
sftp_password=cc.123
sftp_workpath="/var/www/html/appdown/o2o-ios"

analyticsBaseTest="192.168.60.244:8484/Mobstat"
analyticsBase="mobstat.benlai.com"
#--------------------------------------------





#获取shell文件所在的绝对路径
current_path=$(pwd)
tmp_path=$(dirname $0)
cd $tmp_path
shell_path=$(pwd)
cd $current_path






# 1. get parameters

#打branch还是trunk，默认0为都打，1为branch，2为trunk

packRep="0"
#打哪个接口，默认是0，打所有接口，可以打7001，8001，9001，benlai
packAPI="0"

param_pattern="r:tp:"
while getopts $param_pattern optname
do
#echo "-------" + $optname + $OPTIND + $OPTARG
case "$optname" in
"t")
is_testing=n
;;
"r")
tmp_optind=$OPTIND
tmp_optname=$optname
tmp_optarg=$OPTARG
OPTIND=$OPTIND-1
if getopts $param_pattern optname ;then
echo  "Error argument value for option $tmp_optname"
exit 2
fi
OPTIND=$tmp_optind

for idx in ${!arrayRep[@]}; do
rep=${arrayRep[idx]}
echo $tmp_optarg
if [[ $tmp_optarg = $rep ]]; then
arrayRep=($tmp_optarg)

#取相应的path
count=${#arrayPath[@]}
if [ $idx -lt $count ]; then
arrayPath=(${arrayPath[idx]})
else
echo "请在脚本中配置项目路径 arrayPath"
exit 2
fi
fi
done
;;
"p")
tmp_optind=$OPTIND
tmp_optname=$optname
tmp_optarg=$OPTARG
OPTIND=$OPTIND-1
if getopts $param_pattern optname ;then
echo  "Error argument value for option $tmp_optname"
exit 2
fi
OPTIND=$tmp_optind

for api in ${arrayAPI[@]}; do
if [ $tmp_optarg == $api ]; then
arrayAPI=($tmp_optarg)
fi
done
;;
"?")
echo "Error! Unknown option $OPTARG"
exit 2
;;
":")
echo "Error! No argument value for option $OPTARG"
exit 2
;;
*)
echo "Error! Unknown error while processing options"
exit 2
;;
esac
done

echo "packAPI:" ${arrayAPI[@]}
echo "packRep:" ${arrayRep[@]}
echo "path:" ${arrayPath[@]}



# 2. svn revert
 cd $repositoryPath
svn upgrade
svn cleanup #当SVN workspace lock 时 执行cleanup

 svn revert -R .
 echo "svn revert all successfullly!"



# 3. svn update
 svn update
 echo "svn update successfullly!"



# 4. path & API & package
#check validate
repCount=${#arrayRep[@]}
pathCount=${#arrayPath[@]}
if [ $repCount -ne $pathCount ]; then
echo "配置错误，请检查脚本配置区域的arrayRep和arrayPath"
exit 2
fi

#packaging
tmp_save_path=${shell_path}/tmp_save_path
if [ -d ${tmp_save_path} ]; then
rm -rf ${tmp_save_path}
fi
mkdir ${tmp_save_path}

for idx in ${!arrayRep[@]}; do
repPath=${arrayPath[idx]}
myRep=${arrayRep[idx]}
repFullPath="${repositoryPath}${repPath}"
apiFullPath="${repFullPath}${apiPath}"

echo "apiFullPath" ${apiFullPath}

#change api
for api in ${arrayAPI[@]}; do
if [ $api == "192.168.60.33:18005" ]; then
tmp_url="${api}"
tmp_domain="${api}"
tmp_analyticsBase="${analyticsBase}"
tmp_m_url="m.benlai.com/"
elif [ $api == "192.168.60.88:18005" ]; then
tmp_url="${api}"
tmp_domain="${api}"
tmp_analyticsBase="${analyticsBaseTest}"
tmp_m_url="m.benlai.com/"
elif [ $api == "api.o2o.benlai.com" ]; then
tmp_url="${api}"
tmp_domain="${api}"
tmp_analyticsBase="${analyticsBaseTest}"
tmp_m_url="m.benlai.com/"
else
tmp_url="${domainTest}:${api}"
tmp_domain="${domainTest}"
tmp_analyticsBase="${analyticsBaseTest}"
tmp_m_url="m.benlai.com/"
fi

cat << EOF > ${apiFullPath}
#ifndef BenLai_UrlDefinition_h
#define BenLai_UrlDefinition_h

#define K_URL_AnalyticsBase @"${tmp_analyticsBase}/"
#define K_URL_SearchAnalyticsBase   @"searchtracking.benlai.com/"

#define K_URL_BASE @"${tmp_url}/"
#define K_URL_M_BASE        @"${tmp_m_url}"

#define K_URL_DOMAIN_APP @"${tmp_domain}"
#define K_APP_channel   @"developMode"

#endif
EOF

if [ "$is_testing" = "n" ];then
platform=$api
else
platform="${myRep}_${api}"
fi

#react native bundle
cd $repFullPath
export PATH="/usr/local/bin:$PATH"
#不分包的命令
# react-native bundle --entry-file index.ios.js --bundle-output BenLai/main.jsbundle --dev false
#分包的命令
node_modules/.bin/moles-packer --input --entry index.ios.js --output BenlaiO2O --common-output ./BenlaiO2O --platform ios --bundle --dev --verbose
echo "react native bundle successfullly!"

#package
${shell_path}/package_script.sh ${repFullPath} -c AdHoc -o ${tmp_save_path} -w -s BenlaiO2O -n -p $platform
# ${shell_path}/package_script.sh ${repFullPath} -c AdHoc -o ${tmp_save_path} -n -p $platform

done

done



# 5. upload
 ${shell_path}/upload.sh $tmp_save_path ${publish_domain} ${sftp_username} ${sftp_password} ${sftp_workpath} || exit




# 6. refresh html
 ${shell_path}/trigger_server_refresh_html ${sftp_workpath} ${publish_domain} ${sftp_username} ${sftp_password} || exit

