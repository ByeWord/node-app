class BaseException {

}
interface Assert {

    newException(...args:any):BaseException;

    newException(error:Error,...args:any):BaseException;

}