/* eslint-disable react/jsx-handler-names */
import React from 'react'
import { userService } from '../_services'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class LoginPage extends React.Component {
  constructor(props) {
    super(props)

    userService.logout()

    this.state = {
      username: '',
      password: '',
      rut: '',
      submitted: false,
      loading: false,
      error: '',
      toaststyle: { position: toast.POSITION.BOTTOM_RIGHT },
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit(e) {
    e.preventDefault()

    this.setState({ submitted: true })
    const { username, password, rut } = this.state

    // stop here if form is invalid
    if (!(username && password && rut)) {
      return
    }

    this.setState({ loading: true })
    userService.login(username, password, rut).then(
      user => {
        if (!user) {
          this.setState({ loading: false })
          return toast.error('Credenciales incorrectas', this.state.toaststyle)
        }
        const { from } = this.props.location.state || { from: { pathname: '/' } }
        this.props.history.push(from)
      },
      error => {
        toast.error('Credenciales incorrectas', this.state.toaststyle)
        this.setState({ error, loading: false })
      }
    )
  }

  render() {
    const { username, password, rut, submitted, loading, error } = this.state
    return (
      <div className='col-md-6 col-md-offset-3 text-dark' style={{ padding: 40 }}>
        <ToastContainer />
        <h1
          className='nuppy text-white'
          style={{ color: 'black', fontWeight: 600, lineHeight: '10px', fontSize: 60 }}
        >
          NUPY
        </h1>
        <h2 style={{ color: 'black' }}>Iniciar Sesión</h2>
        <form name='form' onSubmit={this.handleSubmit}>
          <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
            <label htmlFor='username' style={{ color: 'black' }}>
              Usuario
            </label>
            <input
              className='form-control'
              name='username'
              type='text'
              value={username}
              onChange={this.handleChange}
            />
            {submitted && !username && <div className='help-block'>Usuario es requerido</div>}
          </div>
          <div className={'form-group' + (submitted && !rut ? ' has-error' : '')}>
            <label htmlFor='rut' style={{ color: 'black' }}>
              RUT
            </label>
            <input
              className='form-control'
              name='rut'
              type='text'
              value={rut}
              onChange={this.handleChange}
            />
            {submitted && !rut && <div className='help-block'>Rut es requerido</div>}
          </div>
          <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
            <label htmlFor='password' style={{ color: 'black' }}>
              Contraseña
            </label>
            <input
              className='form-control'
              name='password'
              type='password'
              value={password}
              onChange={this.handleChange}
            />
            {submitted && !password && <div className='help-block'>Contraseña es requerida</div>}
          </div>
          <div className='form-group'>
            <button
              className='btn btn-primary'
              disabled={loading}
              style={{ width: '100%', padding: 10 }}
            >
              ENTRAR
            </button>
            {loading && (
              <img
                alt='a'
                src='data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=='
              />
            )}
          </div>
          {error && <div className={'alert alert-danger'}>{error}</div>}
        </form>
      </div>
    )
  }
}

export { LoginPage }
