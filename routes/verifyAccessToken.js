const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) =>{

    const authToken = req.headers.token;
    console.log(authToken);
    if(authToken){

        const token = authToken.split(" ")[1];
        console.log(token);

        jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
            if(err){
                return res.status(403).send("Unauthorized Access!!!");
            }
            req.user = user;
            next();
        })

    }
    else{
        return res.status(401).send("You're not authorized to access !!!")
    }
};

const verifyTokenandAuthorisation = (req, res, next) => {
    verifyToken(req, res, ()=>{
        if(req.user.id === req.params.userId || req.body.isAdmin){
            next();
        }else{
            res.status(403).send("You're not authorized");
        }
    })
};

const verifyTokenandAdmin = (req, res, next) => {
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).send("Not authorized to perform this action");
        }
    })
};

module.exports = {
    verifyToken,
    verifyTokenandAuthorisation,
    verifyTokenandAdmin
};