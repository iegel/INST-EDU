import {TOKEN_SECRET} from '../config.js'
import jwt from 'jsonwebtoken'

export function createAccesToken(payload){
    return new Promise ((resolve,reject) => {
        jwt.sign(
            payload,
            TOKEN_SECRET,
        {
            expiresIn: "1d", //expira en 1 dia
        },//creacion de token
        (err,token) => {
            if (err) reject(err) // Si algo sale mal
            resolve(token) // Si sale bien
        }
        );
    })
}
