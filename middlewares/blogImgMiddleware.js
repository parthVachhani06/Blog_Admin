
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, next) => {
      next(null, './images')
    },
    filename:(req, file, next) =>{
      const unik = Date.now() + '-' + file.originalname;
      next(null,unik)
    }
  })

  const upload = multer({storage});

  module.exports = upload;