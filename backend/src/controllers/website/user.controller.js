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

