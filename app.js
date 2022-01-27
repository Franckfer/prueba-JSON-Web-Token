const express = require('express');
const jwt = require('jsonwebtoken');
const port = 3000;

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: "JWT ok!!"
    })
})


app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        name: 'fran',
        email: 'frandanfernandez93'
    }

    //hacemos uso del metodo sign de jsonwebtoken
    //despues le podemos pasar el tiempo de expiracion del token
    jwt.sign({user: user}, 'secretKey', {expiresIn: '30s'}, (err, token) => {
        res.json({
            token:token
        })
    })

})

// Authorization: Bearer <token>
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
        const saveToken = bearerHeader.split(" ")[1]
        //accedemos al segundo elemento separado por el espacio, al token
        req.token = saveToken

        next();

    } else {
        res.sendStatus(403)
    }
}

//al tratar de entrar a esta ruta hacemos uso del middleware verifyToken
//que se encarga de verificar si el usuario esta enviando un token o no,
//en caso de no enviar el token respodemos con el status 403 (acceso o ruta prohibido)
app.post('/api/post', verifyToken, (req, res) => { 
    
    // (authData) hace referencia al objeto user que puede ser nuestra db
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            res.json({
                message: 'Post create successfuly',
                authData: authData
            })
        }
    })

})

app.listen(port, () => {
    console.log(`server running in the port ${port}`);
})
