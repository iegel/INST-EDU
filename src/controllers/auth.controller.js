import User from '../models/user.model.js';
import bcrypt from 'bcryptjs'
import {createAccesToken} from '../libs/jwt.js'
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js'

export const register = async (req, res) => {
    const { email, password, username } = req.body; // me guardo en las constantes lo que recibi en el json
    //    console.log(email,password, username) //para ver que datos me llega desde el cliente (En formato json)

    try {
        const userFound = await User.findOne({email})
        if (userFound) return res.status(400).json(["The email al ready exists"]);
        const passworHash = await bcrypt.hash(password,10) // String aleatorio
        const newUser = new User({
            username,
            email,
            password : passworHash,
        }); // Creacion del usuario utilizando el modelo user
    
        const userSaved = await newUser.save(); // Guardar en la base de datos MongoDB
        const token = await createAccesToken({id: userSaved._id}) // Esto me va a guardar un token

        res.cookie('token',token) //establecer cookie
        // res.json({
        //     message: "User created successfully",
        // })
        res.json({
            id:userSaved._id,
            username:userSaved.username,
            email:userSaved.email,
            createdAt:userSaved.createdAt,
            updatedAt:userSaved.updatedAt
        });    
    } catch (error) {
        //console.log(error);
        res.status(500).json({message: error.message});
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body; // me guardo en las constantes lo que recibi en el json
//        console.log(email,password) //para ver que datos me llega desde el cliente (En formato json)

    try {
        const userFound = await User.findOne({email}) //Si encontro el email
        if (!userFound) return res.status(400).json({message : "User not found"});

        const isMatch = await bcrypt.compare(password,userFound.password) // Si coincide la password devuelve TRUE, sino FALSE

        if (!isMatch) return res.status(400).json({message : "Incorrect password"}); // Si arriba devolvio FALSE lanzo mensaje de error

        const token = await createAccesToken({id: userFound._id}) // Esto me va a guardar un token

        res.cookie('token',token) //establecer cookie
        // res.json({
        //     message: "User created successfully",
        // })
        res.json({
            id:userFound._id,
            username:userFound.username,
            email:userFound.email,
            createdAt:userFound.createdAt,
            updatedAt:userFound.updatedAt
        });    
    } catch (error) {
        //console.log(error);
        res.status(500).json({message: error.message});
    }
};

export const logout = (req,res) =>{
    res.cookie('token',"",{
        expires: new Date(0)
    })
    return res.sendStatus(200);
}

export const profile = async (req,res) => {
    const userFound = await User.findById(req.user.id)
    console.log(req.user)
    if (!userFound) return res.status(400).json({message: "Usuario no encontrado"});
    return res.json({
        id : userFound._id,
        username : userFound.username,
        email : userFound.email,
        createdAt : userFound.createdAt,
        updatedAt : userFound.updatedAt,
    });

}

export const verifyToken = async (req,res) =>{
    const {token} = req.cookies
    if (!token) return res.status(401).json({message: "Unauthorized"})
    jwt.verify(token,TOKEN_SECRET, async (err,user)=>{
        if (err) return res.status(401).json({message: "Unauthorized"})
        const userFound = await User.findById(user.id)
    if (!userFound) return res.status(401).json({message: "Unauthorized"});
    return res.json({
        id:userFound._id,
        username: userFound.username,
        email:userFound.email

    })
    })
}