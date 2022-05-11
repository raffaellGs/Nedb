const NeDB = require('nedb')
const db = new NeDB({
    filename: 'users.db',
    autoload: true
});


module.exports = (app) => {

    let route = app.route('/users');

    // ***************** Pegar Vários Usuários

    route.get((req, res) => {

        db.find({}).sort({ name: 1 }).exec((err, users) => {

            if (err) {

                app.utils.error.send(err, req, res);

            } else {

                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json({
                    users
                });

            }

        });

    });

    // ***************** Cadastrar um Usuários

    route.post((req, res) => {

        req.assert('name', 'O nome é Obrigatório').notEmoty();
        req.assert('email', 'O e-mail está Inválido').notEmoty().ismail();

        let errors = req.validationErrors();

        if(errors){

            app.utils.error.send(errors, req, res);
            return false
        }

        db.insert(req.body, (err, user) => {

            if (err) {

                app.utils.error.send(err, req, res);

            } else {

                res.status(200).json(user)
            }
        })
    });

    // ***************** Pegar um Usuários

    let routeId = app.route('/users/:id');

    routeId.get((req, res ) =>{

        db.findOne({_id:req.params.id}).exec((err, user) =>{

            if (err) {

                app.utils.error.send(err, req, res);

            } else {

                res.status(200).json(user)
            }

        })

    });

    // ***************** Editar um Usuários

    routeId.put((req, res ) =>{

        db.update({_id:req.params.id}, req.body, err =>{

            if (err) {

                app.utils.error.send(err, req, res);

            } else {

                res.status(200).json(Object.assign(req.body, req.params))
            }

        })

    });

    // ***************** Deletar um Usuários

    routeId.delete((req, res ) =>{

        db.remove({_id:req.params.id}, {}, err =>{

            if (err) {

                app.utils.error.send(err, req, res);

            } else {

                res.status(200).json(req.params)
            }

        })

    });


};