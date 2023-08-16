import request from 'request';

const httpClient=request;


async function main() {
    function fetchPromise():Promise<any>{
        return new Promise((reject, resolve)=>{
            httpClient({
                'method': 'get',
                'url': 'https://example.com',
              }, (err, res,body)=>{
                if (err){
                    console.log("error occured")
                    reject("Error")
                };
    
                resolve("Resloved")
            })
        })
    }
    try{
        const promiseResult=await fetchPromise();
        console.log(promiseResult)
    }catch(err:any){
        console.log("From catch block")
        console.log(err)
    }
    return
}

main()

