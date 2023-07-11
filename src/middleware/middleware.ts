import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtSecret } from "../config";

export const allowCrossDomain = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");

  // intercept OPTIONS method
  if ("OPTIONS" == req.method) {
    res.status(200).send(200);
  } else {
    next();
  }
};

export async function checkAuthentication(
  req: Request,
  res: Response,
  next: any
) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      error: "Unauthorized",
      message: "No token provided in the request",
    });
  }
  /*
  const token = req.headers.authorization.substring(6);
  // const cookie = req.headers.authorization;
  // const token = cookie.substring(cookie.indexOf("=") + 1);

  console.log("check authentication", token);
  */
  
  let token = '';
  const cookies = req.headers.authorization?.split(';');
  if (cookies) {
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('userLogin=')) {
        token = cookie.substring(10); 
        break;
      }
    }
  }

  // verifies secret and checks exp
  jwt.verify(token, JwtSecret, (err, decoded) => {
    if (err)
      return res.status(401).send({
        error: "Unauthorized",
        message: "Failed to authenticate token.",
      });
    // if token is valid, save userid to request for use in other routes
    //@ts-ignore
    req.userId = decoded.id;
    next();
  });
}


export async function checkAdminAuthentication(
  req: Request,
  res: Response,
  next: any
) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      error: "Unauthorized",
      message: "No token provided in the request",
    });
  }
  
  let token = '';
  const cookies = req.headers.authorization?.split(';');
  if (cookies) {
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('adminLogin=')) {
        token = cookie.substring(11); 
        break;
      }
    }
  }
  console.log(cookies,token);
  if (token.length===0){
    return res.status(401).send({
      error: "Unauthorized",
      message: "Failed to authenticate token.",
    });
  }
  else{
    next();
  }
}