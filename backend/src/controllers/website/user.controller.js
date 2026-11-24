import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../../models/user.model.js";

const saltRounds = 10;


//Register

export const register = async (request, response) => {
  try {
    const saveData = request.body;
    saveData.password = await bcrypt.hash(saveData.password, saltRounds);
    saveData.role_type = "user";

    UserModel(saveData)
      .save()
      .then(async (result) => {
        const secretKey = process.env.secret_key;
        var token = await jwt.sign({ userId: result._id, role_type: result.role_type,} ,secretKey,);

        var userData = result.toObject();
        delete userData.password;

        const data = {
          _status: true,
          _message: "Account registered successfully.",
          _token: token,
          _data: userData,
        };

        return response.status(201).send(data);
      })
      .catch((error) => {
          console.log("Registration Error:", error);
        var errorMessages = {};

          for (var key in error.errors) {
            errorMessages[key] = error.errors[key].message;
        }

        const data = {
          _status: false,
          _message: "Something went wrong.",
          _error: errorMessages,
          _data: "",
        };

        return response.status(400).send(data);
      });
  } catch (error) {
    const data = {
      _status: false,
      _message: "Something wrong with the server.",
      _error: error.message,
      _data: null,
    };

    return response.status(500).send(data);
  }
};

//login

export const login = async (request, response) => {

    try {

        var checkUser = await UserModel.findOne({
            email: request.body.email,
            role_type: "user",
            status: true
        });

        if (!checkUser) {
            const data = {
                _status: false,
                _message: "Account does not exist.",
                _data: ""
            };

            return response.send(data);
        }

        var checkPassword = await bcrypt.compare(
            request.body.password,
            checkUser.password
        );
        if (!checkPassword) {
            const data = {
                _status: false,
                _message: "Password is incorrect.",
                _data: ""
            };

            return response.send(data);
        }
        const secretKey = process.env.secret_key;
        
        var token = await jwt.sign(
            {
                userId: checkUser._id,
                role_type: checkUser.role_type
            },
            secretKey
        );
        var userData = checkUser.toObject();
        delete userData.password;
        const data = {
            _status: true,
            _message: "User login successfully.",
            _token: token,
            _data: userData
        };
        return response.send(data);

    } catch (error) {
        const data = {
            _status: false,
            _message: "Something wrong with the server.",
            _error: error.message,
            _data: null
        };

        return response.status(500).send(data);
    }
};

//view

export const viewProfile = async (request, response) => {
  try {
    const userData = await UserModel.findOne({
      _id: request.userId,
      role_type: "user",
    }).select("-password");

    if (!userData) {
      const data = {
        _status: false,
        _message: "Account doesn't exist.",
        _data: "",
      };

      return response.send(data);
    }

    const data = {
      _status: true,
      _message: "Record found.",
      _data: userData,
    };

    return response.send(data);
  } catch (error) {
    const data = {
      _status: false,
      _message: "Something wrong with the server.",
      _error: error.message,
      _data: null,
    };

    return response.send(data);
  }
};

export const updateProfile = async(request, response) => {

    try {
        var userData = await UserModel.findOne({ _id : request.userId, role_type : 'user' });

        if(!userData){
            const data = {
                _status : false,
                _message : "Account doesn't exist.",
                _data : ''
            }

            return response.send(data);
        }

        // Only these fields can be changed from profile
        var body = request.body || {};

        ['name', 'email', 'mobile_number', 'address', 'age', 'gender'].forEach((key) => {
            if(body[key] !== undefined){
                // Empty field is saved as null (enum / min / max validators allow null but not '')
                userData[key] = body[key] === '' ? null : body[key];
            }
        });

        userData.updated_at = Date.now();

        // validateModifiedOnly : otherwise the unique email validator finds this same user and fails
        await userData.save({ validateModifiedOnly : true });

        var result = userData.toObject();
        delete result.password;

        const data = {
            _status : true,
            _message : "Profile updated succussfully.",
            _data : result
        }

        return response.send(data);
    } catch (error) {
        var errorMessages = {};

        for(var key in error.errors){
            errorMessages[key] = error.errors[key].message
        }

        const data = {
            _status : false,
            _message : "Something went wrong.",
            _error : errorMessages,
            _data : ''
        }

        return response.send(data);
    }
}


