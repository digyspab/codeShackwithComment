
const Auth = {
    is_login: (req, res, next) => {
        if (!req.session.is_login) {
             res.redirect('/users/profile');
        } else{
             res.redirect('/users/login');

        }
        return next();
    },

    is_admin: (req, res, next) => {
        if (!req.session.is_admin) {
            return res.redirect('/admin/dashboard');
        }
        next();
    }
};

module.exports = Auth;

