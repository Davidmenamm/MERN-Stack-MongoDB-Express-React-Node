var express = require("express");
var app = express();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var multer = require('multer'),
  bodyParser = require('body-parser'),
  path = require('path');
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/local");
var fs = require('fs');
var user = require("./model/user.js");
var validate = require("validate.js");

var dir = './uploads';
var upload = multer({
  storage: multer.diskStorage({

    destination: function (req, file, callback) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './uploads');
    },
    filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(/*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
  }
});
app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

app.use("/", (req, res, next) => {
  try {
    if (req.path == "/login" || req.path == "/register" || req.path == "/") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'Apis'
  });
});

/* login api */
app.post("/login", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.find({ username: req.body.username }, (err, data) => {
        if (data.length > 0) {

          if (bcrypt.compareSync(data[0].password, req.body.password)) {
            checkUserAndGenerateToken(data[0], req, res);
          } else {

            res.status(400).json({
              errorMessage: 'Username or password is incorrect!',
              status: false
            });
          }

        } else {
          res.status(400).json({
            errorMessage: 'Username or password is incorrect!',
            status: false
          });
        }
      })
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/* register api */
app.post("/register", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {

      user.find({ username: req.body.username }, (err, data) => {

        if (data.length == 0) {

          let User = new user({
            username: req.body.username,
            password: req.body.password
          });
          User.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            } else {
              res.status(200).json({
                status: true,
                title: 'Registered Successfully.'
              });
            }
          });

        } else {
          res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false
          });
        }

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign({ user: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.status(400).json({
        status: false,
        errorMessage: err,
      });
    } else {
      res.json({
        message: 'Login Successfully.',
        token: token,
        status: true,
        id: data._id,
        typeAccount: data.typeAccount
      });
    }
  });
}

/* Api to add Product */
app.post("/add-employee", upload.any(), (req, res) => {
  try {    
    if (req.files && req.body && req.body.name && req.body.apellido && req.body.cedula &&
      req.body.correo) {
      // validate constraints
      let constraints = {
        file: {},
        name: {},
        apellido: {},
        cedula: { length: {is: 10} },
        email: { email: true },
        id: {},
        type_account: {},
      };
      // validate
      let validation = validate({
        // file:           req.files[0].filename,
        name:           req.body.name,
        apellido:       req.body.apellido,
        cedula:         req.body.cedula,
        email:          req.body.correo,
        id:             req.body.fechaNac,
        type_account:   req.body.dir,
      }
      , constraints);
      // validation
      if (validation===undefined){ // when everything is fine nothing is returned
        // not repeat user
        user.find({ cedula: req.body.cedula }, (err, old_usr) => {
          console.log('old_usr', old_usr);
          if( old_usr && !(old_usr[0]) ){
            // new user
            let new_product = new user();
            new_product.image = req.files[0].filename;
            new_product.name = req.body.name;
            new_product.apellido = req.body.apellido;
            new_product.cedula = req.body.cedula;
            new_product.correo = req.body.correo;
            new_product.user_id = req.user.id;
            new_product.typeAccount = req.body.typeAccount;
            new_product.save((err, data) => {
              if (err) {
                res.status(400).json({
                  errorMessage: err,
                  status: false
                });
              } else {
                res.status(200).json({
                  status: true,
                  title: 'Product Added successfully.'
                });
              }
            });
          } else {
            console.log('error exists');
            res.status(400).json({
              errorMessage: 'User Already Exists!',
              status: false
            });
          }
        })
      } else {
        res.status(400).json({
          errorMessage: JSON.stringify(validation),
          status: false
        });
      }
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    console.log(e)
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to update Person */
app.post("/update-person", upload.any(), (req, res) => {
  try {

    console.log('in');
    console.log(
      req.body,
      req.files
    );

    if (req.files && req.body && req.body.name && req.body.apellido && req.body.cedula &&
      req.body.id && req.body.correo) {
      console.log('body;', req.body);
      user.findById(req.body.id, (err, new_item) => {
        // validate constraints
        let constraints = {
          file: {},
          name: {},
          apellido: {},
          cedula: { length: {is: 10} },
          email: { email: true },
          fechaNac: {},
          dir: {},
          cel: { length: {is: 10-1} },
          vaccine_status: {},
          vaccine_type: {},
          vaccine_date: {},
          vaccine_dosis: {}
        };
        // validate
        let validation = validate({
          // file:           req.files[0].filename,
          name:           req.body.name,
          apellido:       req.body.apellido,
          cedula:         req.body.cedula,
          email:         req.body.correo,
          fechaNac:       req.body.fechaNac,
          dir:            req.body.dir,
          cel:            req.body.cel,
          vaccine_status: req.body.vaccine_status,
          vaccine_type:   req.body.vaccine_type,
          vaccine_date:   req.body.vaccine_date,
          vaccine_dosis:  req.body.vaccine_dosis
        }
        , constraints);
        console.log('VALIDATION', validation);
        // validation
        if (validation===undefined){ // when everything is fine nothing is returned
          // primary fields
          // if file already exist than remove it
          if (req.files && req.files[0] && req.files[0].filename && new_item.image) {
            var path = `./uploads/${new_item.image}`;
            fs.unlinkSync(path);
          }

          if (req.files && req.files[0] && req.files[0].filename) {
            new_item.image = req.files[0].filename;
          }
          if (req.body.name) {
            new_item.name = req.body.name;
          }
          if (req.body.apellido) {
            new_item.apellido = req.body.apellido;
          }
          if (req.body.cedula) {
            new_item.cedula = req.body.cedula;
          }
          if (req.body.correo) {
            console.log( 'validate', typeof(req.body.correo) );
            new_item.correo = req.body.correo;
          }
          // secondary fields
          if (req.body.fechaNac) {
            new_item.fechaNac = req.body.fechaNac;
          }
          if (req.body.dir) {
            new_item.dir = req.body.dir;
          }
          if (req.body.cel) {
            new_item.cel = req.body.cel;
          }
          // vaccination fields
          if (req.body.vaccine_status) {
            new_item.vaccine_status = req.body.vaccine_status;
          }
          if (req.body.vaccine_type) {
            new_item.vaccine_type = req.body.vaccine_type;
          }
          if (req.body.vaccine_date) {
            new_item.vaccine_date = req.body.vaccine_date;
          }
          if (req.body.vaccine_dosis) {
            new_item.vaccine_dosis = req.body.vaccine_dosis;
          }
          // type account
          if (req.body.typeAccount) {
            new_item.typeAccount = req.body.typeAccount;
          }
          // save item
          new_item.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            } else {
              console.log('DATA', new_item);
              let objJsonStr = JSON.stringify(new_item);
              let objJsonB64 = Buffer.from(objJsonStr).toString("base64");
              res.status(200).json({
                status: true,
                title: 'Person updated.',
                updatePath: objJsonB64
              });
            }
          });
        } else {
          res.status(400).json({
            errorMessage: JSON.stringify(validation),
            status: false
          });
        }
      });
    // error parameters
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  // error try-catch
  } catch (e) {
    res.status(400).json({
      errorMessage: `Something went wrong!`,
      req: req.body,
      status: false
    });
  }
});

/* Api to delete Product */
app.post("/delete-product", (req, res) => {
  try {
    if (req.body && req.body.id) {
      user.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
        if (data.is_delete) {
          res.status(200).json({
            status: true,
            title: 'Product deleted.'
          });
        } else {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/*Api to get and search product with pagination and search by name*/
app.get("/get-product", (req, res) => {
  console.log('getproduct', req.user, 'query', req.query, 'body', req.body, 'search', req.query.search);
  
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      user_id: req.user.id
    });
    // search name
    if (req.query && req.query.search) {
      query["$and"].push({
        name: { $regex: req.query.search }
      });
    }
    // search status
    if (req.query && req.query.searchStatus) {
      query["$and"].push({
        vaccine_status: { $regex: req.query.searchStatus }
      });
    }
    // search type
    if (req.query && req.query.searchType) {
      query["$and"].push({
        vaccine_type: { $regex: req.query.searchType }
      });
    }
    // vaccine date ranges
    console.log('check', req.query && req.query.initDate && req.query.endDate)
    console.log('check', req.query && req.query.initDate)
    if (req.query && req.query.initDate && req.query.endDate) {
      console.log('CHECKING')
      console.log('dates', req.query.initDate, req.query.endDate)
      console.log(new Date(req.query.initDate), new Date(req.query.initDate).toISOString(), new Date( new Date(req.query.initDate).toISOString() ) )
      query["$and"].push({
        vaccine_date: {
          $gte: new Date(req.query.initDate),
          $lt:  new Date(req.query.endDate)
        }
      });
    }
    var perPage = 4;
    var page = req.query.page || 1;
    console.log('outside');
    user.find(query,
      { name : 1, apellido : 1, cedula : 1, image : 1, correo : 1,
        user_id: 1, fechaNac : 1, vaccine_dosis: 1, vaccine_date : 1,
        vaccine_status: 1, vaccine_type : 1, _id : 1, date : 1, cel : 1,
        dir : 1, typeAccount: 1}
      )
      .skip((perPage * page) - perPage).limit(perPage)
      .then((data) => {
        console.log('inside', data, query);
        user.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: 'Product retrived.',
                products: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'There is no employee!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/* Api to get the information of a specific employee */
app.get("/get-employee", (req, res) => {
  try {
    console.log('in');
    console.log(
      req.query
    );

    if (req.query.id) {
      console.log('query;', req.query);
      user.findById(req.query.id, (err, item) => {
      
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
          console.log('DATA', item);
          let objJsonStr = JSON.stringify(item);
          let objJsonB64 = Buffer.from(objJsonStr).toString("base64");
          res.status(200).json({
            status: true,
            title: 'Person retrieved.',
            updatePath: objJsonB64
          });
        }
      });
    // error parameters
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  // error try-catch
  } catch (e) {
    res.status(400).json({
      errorMessage: `Something went wrong!`,
      req: req.body,
      status: false
    });
  }

});

app.listen(2000, () => {
  console.log("Server is Runing On port 2000");
});
