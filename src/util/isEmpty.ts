// func for checking if obj is empty
const isEmpty = (obj:any) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export { isEmpty }