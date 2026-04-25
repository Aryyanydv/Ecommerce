const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "projectImages/";

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, uploadDir);
    },
    filename : function(req, file, cb){
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const uploadProjectImage = multer({storage});

module.exports = uploadProjectImage;