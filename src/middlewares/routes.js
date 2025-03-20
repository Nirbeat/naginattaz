export function viewsRoutesErrorHandler(err, req, res, next){
    console.log(err.message)
    res.redirect('/construccion')
}

// ESTA ATAJA EL ERROR DE LOGIN
export function unexpectedError(err, req, res, next){
    res.redirect('/server-error')
    next(err)
}