class Utils {
    constructor() {}

    static addArrays(arr1, arr2) {
        let res = []
        for (let i = 0; i < arr1.length; i++) {
            res.push(arr1[i] + arr2[i]);
        }
        return res;
    }
    static calculateDistance(positionArray) {
        return Math.sqrt(positionArray[0] ** 2 + positionArray[1] ** 2 + positionArray[2] ** 2);
    }
    
    static subArrays(arr1, arr2){
        let res = []
        for(let i= 0; i < arr1.length; i++){
            res.push(arr1[i] - arr2[i]);
        }
        return res;
    }
}