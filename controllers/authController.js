import { comparePassword, hashPassword } from "../helpers/authhelpers.js";
import userModels from "../models/userModels.js";
import OrderModels from "../models/OrderModel.js";
import JWT from "jsonwebtoken";

//Register Controller
export const registerController = async (req, res) => {
  try {
    const { name, email, phoneNo, address, password, role, answer } = req.body;
    if (!(name && email && phoneNo && address && password)) {
      return res.send({ error: "Enter the missing field" });
    }

    const existingUser = await userModels.findOne({ email });

    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please Login",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = new userModels({
      name,
      email,
      address,
      phoneNo,
      password: hashedPassword,
      role,
      answer,
    });

    user.save();
    res.status(201).send({
      success: true,
      message: "user register is successfull",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

//Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const dataUser = await userModels.findOne({ email });
    if (!dataUser) {
      return res.send({
        success: false,
        message: "User with this email does not exist",
      });
    }

    const match = await comparePassword(password, dataUser.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //Token Generation if Login is Successfull

    const token = await JWT.sign(
      { _id: dataUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).send({
      success: true,
      message: "Login is successfull.",
      user: {
        name: dataUser.name,
        email: dataUser.email,
        phoneNo: dataUser.phoneNo,
        address: dataUser.address,
        role: dataUser.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.staus(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//Protected Route Controller

export const protectedController = (req, res) => {
  res.send({
    message: "Working in Protected",
  });
};

//Forget Password controller

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    const user = await userModels.findOne({ email, answer });

    if (!email || !newPassword || !answer) {
      return res
        .status(400)
        .send({ message: "Please enter all the required information" });
    }

    if (!user) {
      return res
        .status(200)
        .send({ message: "Wrong Email or Answer", success: false });
    }

    const hashedPassword = await hashPassword(newPassword);
    await userModels.findByIdAndUpdate(user._id, { password: hashedPassword });
    res.status(200).send({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went Wrong",
      error,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, password, address, phoneNo } = req.body.user_info;

    const user = await userModels.findById(req.user._id);

    let hash;
    if (password) {
      hash = await hashPassword(password);
    }

    const updateUser = await userModels.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        address: address || user.address,
        phoneNo: phoneNo || user.phoneNo,
        password: hash || user.password,
        email: user.email,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went Wrong in Updating the Profile",
      error,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await OrderModels.find({
      buyer: req.user._id,
    })
      .populate("products", "-photo")
      .populate("buyer", "name");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went Wrong while getting orders",
      error,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModels.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went Wrong while getting orders",
      error,
    });
  }
};

export const orderStatusController = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await req.body.newVal;

    const order = await OrderModels.findByIdAndUpdate(
      id,
      { status: data },
      { new: true }
    );
    console.log("Working fine upto here....")
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went Wrong while getting orders",
      error,
    });
  }
};
