const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const mailer = require("../../modules/mailer");

const { HASH_SECRET } = require("../../modules/config");

const User = require("../models/user"); //necessário para realizar os cadastros

const router = express.Router(); //é possível definir as rotas para o usuário

function generateToken(params = {}) {
  return jwt.sign(params, HASH_SECRET, {
    expiresIn: 86400, //expira em 1 dia, 86400s
  });
}

router.post("/register", async (req, res) => {
  const { email } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: "User email already exists" });
    }

    const user = await User.create(req.body);
    const token = generateToken({ id: user.id });

    user.password = undefined;

    res.send({
      user,
      token,
    });
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Registration failed. Please try again." });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).send({ error: "User not found" });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: "Invalid password" });
  }

  const token = generateToken({ id: user.id });

  user.password = undefined;
  res.send({
    user,
    token,
  });
});

router.post("/forgot_password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).send({ error: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passworResetExpires: now,
      },
    });
    mailer.sendMail(
      {
        to: email,
        from: "forgotpassword@email.com",
        html: `<p>Você esqueceu sua senha? Utilize esse token: ${token}</p>`,
      },
      (err) => {
        if (err) {
          res.status(400).send({ error: "Cannot send forgot password email" });
        }
        res.status(200).send("Email enviado");
      }
    );
    // res.send({ TOKEN: token, DATE: now });
  } catch (err) {
    res.status(400).send({ error: "Error on forgot password. Try Again." });
  }
});

router.post("/reset_password", async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const user = await User.findOne({ email: email }).select(
      "+passwordResetToken passworResetExpires"
    );

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    if (token !== user.passwordResetToken) {
      return res.status(400).send({ error: "Invalid token" });
    }

    const now = new Date();

    if (now.getHours() > user.passworResetExpires) {
      return res
        .status(400)
        .send({ error: "Token expired. Generate a new one." });
    } else {
      user.password = password;
      await user.save();
      res.status(200).send("Senha alterada com sucesso.");
    }
  } catch (err) {
    res.status(400).send({ error: "Error on reset" });
  }
});

module.exports = (app) => {
  app.use("/auth", router);
};
