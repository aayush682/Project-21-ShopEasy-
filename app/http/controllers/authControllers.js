function authController() {
  return {
    register(req, res) {
      res.render('auth/register')
    },
    login(req, res) {
      res.render('auth/login')
    }
  }
}

module.exports = authController;