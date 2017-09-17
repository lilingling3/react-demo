/**
 * Created by zhongzhengkai on 2017/5/4.
 */

var path = require('path');

var ROOT_PATH = path.join(__dirname , '../../../');

module.exports = {
  PORT:3222,
  ROOT_PATH: ROOT_PATH,
  WWW_PATH: path.join(ROOT_PATH + 'www'),
  WWW_PUBLIC_PATH: path.join(ROOT_PATH ,'www/public'),
  WWW_VIEWS_PATH: path.join(ROOT_PATH , 'www/views'),
  WWW_FILE_PATH: path.join(ROOT_PATH , 'www/public/file'),
};