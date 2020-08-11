// Importar el modelo
const Usuario = require("../models/Usuario");

const passwordValidator = require('password-validator');

var schema = new passwordValidator();
schema
// minimo 8 caracteres
.is().min(8)                                  
// maximo 10 caracteres
.is().max(100)                                
// por lo menos una mayuscula
.has().uppercase()                            
// por lo menos una minuscula
.has().lowercase()                             
// por lo menos un numero
.has().digits(1)                               
//  no debe contener espacios
.has().not().spaces()                           
// contraseñas restringidas
.is().not().oneOf(['Contrasena123', 'Password123']); 


exports.formularioCrearCuenta = (req, res, next) => {
  res.render("registrarse", { layout: "auth" });
};

exports.crearCuenta = async (req, res, next) => {
  // Obtener los datos de la nueva cuenta
  // Obtener por destructuring
  const { fullname, email, password, cpassword } = req.body;

  if (req.body.password == req.body.cpassword) {
    if(schema.validate(password)){
      // Intentar crear el usuario
    try {

      // Crear el usuario
      await Usuario.create({
        fullname,
        email,
        password,
      });

      // Redireccionar el usuario al formulario de inicio de sesión
      res.redirect("iniciar_sesion");
    } catch (error) {
      res.render("registrarse", { layout: "auth", error: error.message });
    }
    }
    else{
      res.render("registrarse", { layout: "auth", error: "La contraseña debe contener una mayuscula, una minuscula, un numero, debe ser mayor a 8 caracteres y menor que 100 y no debe contener espacios" });
    }
    
  }
  else{
    res.render("registrarse", { layout: "auth", error: "Las contraseñas no coinciden" });
  }
};

exports.formularioIniciarSesion = (req, res, next) => {
  // Verificar si existe algún mensaje
  const messages = res.locals.messages;

  res.render("iniciar_sesion", { layout: "auth", messages });
};

exports.formularioRestablecerPassword = (req, res, next) => {
  res.render("restablecer_password", { layout: "auth" });
};
