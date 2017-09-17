/**
 * Created by zhongzhengkai on 2017/6/6.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/lab';
import * as cf from '../../base/common-func';
import ReactPaint from '../common/paint';

var d1 = {position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999, backgroundColor: 'white'};
var d2 = {width: '100%', height: '100%'};


function rotateBase64Image(base64data, givenDegrees, callback) {
  const degrees = givenDegrees % 360;
  if (degrees % 90 !== 0 || degrees === 0) {
    callback(base64data);
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d");

  const image = new Image();
  image.src = base64data;
  image.onload = function() {
    if (degrees === 180) {
      canvas.width = image.width;
      canvas.height = image.height;
    } else {
      canvas.width = image.height;
      canvas.height = image.width;
    }
    ctx.rotate(degrees * Math.PI / 180);
    if (degrees === 90) {
      ctx.translate(0, -canvas.width);
    } else if (degrees === 180) {
      ctx.translate(-canvas.width, -canvas.height);
    } else if (degrees === 270) {
      ctx.translate(-canvas.height, 0);
    }
    ctx.drawImage(image, 0, 0);
    callback(canvas.toDataURL());
  };
}

function DownloadFile(URL, Folder_Name, File_Name) {
  //Parameters mismatch check
  alert('download hahahah！');
  if (URL == null && Folder_Name == null && File_Name == null) {
    alert('路径故障');
    return;
  }
  else {
    alert('0');
    //checking Internet connection availablity
    // var networkState = navigator.connection.type;
    // if (networkState == Connection.NONE) {
    //   alert('网络故障');
    //   return;
    // } else {
    alert('1');
    download(URL, Folder_Name, File_Name); //If available download function call
    // }
  }
}

function download(URL, Folder_Name, File_Name) {
//step to request a file system
  alert('2');
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);
  //alert('3');
  function fileSystemSuccess(fileSystem) {
    alert('4');
    var download_link = encodeURI(URL);
    // ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL
    //
    // var directoryEntry = fileSystem.root; // to get root path of directory
    // directoryEntry.getDirectory(Folder_Name, {create: true, exclusive: false}, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
    // var rootdir = fileSystem.root;
    // var fp = rootdir.toURL(); // Returns Fulpath of local directory

    //fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
    // download function call
    //filetransfer(download_link, fp);
    alert('5');
    saveImageToPhone(download_link, success, error);
  }

  function onDirectorySuccess(parent) {
    // Directory created successfuly
    alert('Directory created successfuly');
  }

  function onDirectoryFail(error) {
    //Error while creating directory
    alert("Unable to create new directory: " + error.code);
  }

  function fileSystemFail(evt) {
    //Unable to access file system
    alert(evt.target.error.code);
  }
}

function filetransfer(download_link, fp) {
  alert('5');
  var fileTransfer = new FileTransfer();
  alert('6');
// File download function with URL and local path
  fileTransfer.download(download_link, fp,
    function (entry) {
      alert("download complete: " + entry.fullPath);
    },
    function (error) {
      //Download abort errors or download failed errors
      alert("download error source " + error.source);
      //alert("download error target " + error.target);
      //alert("upload error code" + error.code);
    }
  );
}

function saveImageToPhone(url, success, error) {

  alert('9');
  var canvas, context, imageDataUrl, imageData;
  var img = new Image();
  alert('9.1');
  img.onload = function () {
    alert('10');
    canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    alert('11');
    try {
      imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
      imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
      cordova.exec(
        success,
        error,
        'Canvas2ImagePlugin',
        'saveImageDataToLibrary',
        [imageData]
      );
    }
    catch (e) {
      alert('7' + e.message);
    }
  };
  try {
    alert('12');
    document.body.appendChild(img);
    img.src = url;
    alert('13');
  }
  catch (e) {
    alert('8' + e.message);
  }
}

var success = function (msg) {
  alert('success:' + msg);
};

var error = function (err) {
  alert('err:' + err);
};

class Lab extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {d:d2, base64:'',photoURI:''};
    cf.bindThis(this,['show','onTouchEnd','takePhoto','upload','downloadImageToGallery'])
  }

  takePhoto(){
    cf.takePhoto((err, photoURI)=>{
      if(err)alert(err);
      else this.setState({photoURI});
    });
  }

  downloadImageToGallery(){
    DownloadFile('https://imagetest.boldseas.com/group1/M00/00/02/wKgC11lDfb-AcxVQAAG1oXORdEs783.png',
      'data','wKgC11lDfb-AcxVQAAG1oXORdEs783');
  }

  upload(){
    this.props.actions.upload(this.state.photoURI,'vin_pic');
  }

  onTouchEnd(str) {
    rotateBase64Image(str, 270, result=>this.state.base64 = result);
  }

  show(str){
    this.forceUpdate();
  }

  render() {
    console.log('%cLab', 'color:green');
    var {base64, d, photoURI} = this.state;
    var imgView = '';
    if(base64)imgView = <img style={{width:300,border:'1px solid red'}} src={base64} />;
    console.log('---------------->>>>',base64);

    var photoView = '';
    if(photoURI) photoView = <img  style={{width:cf.getCSSPixelWidth()}} src={photoURI}/>;

    const props = {
      style: {
        background: 'white',
        /* Arbitrary css styles */
      },
      brushCol: 'black',
      lineWidth: 6,
      width: cf.getCSSPixelWidth()-100,
      height: cf.getCSSPixelHeight()-100,
      onDraw: (str) => { console.log('i have drawn! '+str); },
      onTouchEnd:this.onTouchEnd
    };

    return (
      <div style={d}>
        {imgView}
        <canvas id="____c" style={{display:'none'}}></canvas>
        <button onClick={this.onTouchEnd}>screen shot</button>
        <button onClick={this.show}>show</button>
        <input type="file" name="file" accept="image/*" capture="camera"/>
        <button onClick={this.takePhoto}>take photo</button>
        <button onClick={this.upload}>upload</button>
        <button onClick={this.downloadImageToGallery}>downloadImageToGallery</button>
        <ReactPaint ref="paint" {...props} />
        <h6>{photoURI}</h6>
        {photoView}
      </div>
    );
  }

}

export default connect(state=> ({
  common: state.common
}), dispatch=> ({
  actions: bindActionCreators(actions, dispatch)
}))(Lab)
