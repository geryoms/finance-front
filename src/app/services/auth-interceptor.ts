import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //recordar borrar el log
  const token = localStorage.getItem('jwt_token');
  
  console.log('--- INTERCEPTOR ---');
  console.log('URL:', req.url);
  console.log('Token encontrado:', token ? 'SÍ' : 'NO (Es null)');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};