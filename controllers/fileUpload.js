const File = require("../models/File");

const cloundinary = require("cloudinary").v2;

// localfileupload = handler function
exports.localFileUpload = async (req, res) => {
  try {
    // fetch file
    const file = req.files.file;
    console.log("FILE AA GYI JEE ->", file);
    let path =
      __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
    console.log("PATH->", path);

    file.mv(path, (err) => {
      console.log(err);
    });
    res.json({
      success: true,
      message: "Local FileUpload Successfully",
    });
  } catch (error) {
    console.log("Not able to upload the file on server");

    console.log(error);
  }
};

function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder) {
  const options = { folder };
  await cloundinary.uploader.upload(file.tempFilePath);
}

// image upload ka handler

exports.imageUpload = async (req, res) => {
  try {
    //data fetch
    const { name, tags, email } = req.body;
    console.log(name, tags, email);
    const file = req.files.imageFile;
    console.log(file);

    // validation
    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File formate not supported",
      });
    }

    // file formate supported
    const response = await uploadFileToCloudinary(file, "Hacker");

    // db se entry save krna
    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });
    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "Image Successfully upload",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
