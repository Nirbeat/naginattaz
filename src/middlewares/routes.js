export function viewsRoutesErrorHandler(err, req, res, next){
    console.log(err.message)
    res.redirect('/construccion')
}